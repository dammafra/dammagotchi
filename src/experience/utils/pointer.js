import Experience from '@experience'
import { Raycaster, Vector2 } from 'three'
import { DragControls } from 'three/addons/controls/DragControls.js'

export default class Pointer {
  #enabled = false

  set enabled(value) {
    this.#enabled = value
    if (this.drag) this.drag.enabled = value
  }

  constructor() {
    this.experience = Experience.instance
    this.canvas = this.experience.canvas
    this.sizes = this.experience.sizes
    this.camera = this.experience.camera

    this.raycaster = new Raycaster()
    this.clickableObjects = new Map()
    this.draggableObjects = new Map()
    this.currentIntersect = null
    this.#enabled = true

    // Setup
    this.x = 0
    this.y = 0

    this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (this.isTouchDevice) {
      window.addEventListener('touchstart', this.touchstart)
      window.addEventListener('touchend', this.mouseup)
    } else {
      window.addEventListener('mousemove', this.setMouse)
      window.addEventListener('mousedown', this.mousedown)
      window.addEventListener('mouseup', this.mouseup)
    }
  }

  setMouse = event => {
    this.clientX = event.clientX
    this.clientY = event.clientY

    this.x = (event.clientX / this.sizes.width) * 2 - 1
    this.y = -((event.clientY / this.sizes.height) * 2 - 1)
  }

  touchstart = event => {
    const touch = event.changedTouches[0]
    this.mousedown(touch)
  }

  mousedown = event => {
    if (event.target !== this.canvas) return

    this.setMouse(event)
    this.update()

    const callback = this.clickableObjects.get(this.currentIntersect)
    if (this.#enabled && callback && callback.start) {
      this.currentClicked = this.currentIntersect
      this.camera.controls.enabled = false
      callback.start()
    }
  }

  mouseup = () => {
    const callback = this.clickableObjects.get(this.currentClicked)
    if (this.#enabled && callback && callback.end) {
      this.camera.controls.enabled = true
      callback.end()
    }
  }

  update() {
    this.raycaster.setFromCamera(new Vector2(this.x, this.y), this.camera.instance)

    const test = Array.from(this.clickableObjects.keys())
    const intersects = this.raycaster.intersectObjects(test)
    this.currentIntersect = intersects.length ? intersects[0].object : null

    if (this.currentIntersect && this.clickableObjects.get(this.currentIntersect)) {
      this.canvas.classList.add('pointer')
    } else {
      this.canvas.classList.remove('pointer')
    }
  }

  onClick(object, callback) {
    this.clickableObjects.set(object, callback)
  }

  cancelClick(object) {
    this.clickableObjects.delete(object)
    this.camera.controls.enabled = true
  }

  onDrag(object, callback) {
    const previousObjects = this.drag?.getObjects() || []
    this.draggableObjects.set(object, callback)

    this.setDrag([...previousObjects, object])
  }

  cancelDrag(object) {
    const filteredObjects = this.drag?.getObjects().filter(o => o.uuid !== object.uuid) || []
    this.draggableObjects.delete(object)

    this.setDrag(filteredObjects)
    this.camera.controls.enabled = true
  }

  setDrag(objects) {
    this.drag?.dispose()
    this.drag = new DragControls(objects, this.camera.instance, this.canvas)

    this.drag.addEventListener('hoveron', () => this.canvas.classList.add('grab'))
    this.drag.addEventListener('hoveroff', () => this.canvas.classList.remove('grab'))
    this.drag.addEventListener('dragstart', () => {
      this.camera.controls.enabled = false
      this.canvas.classList.add('grabbing')
    })
    this.drag.addEventListener('dragend', () => {
      this.camera.controls.enabled = true
      this.canvas.classList.remove('grabbing')
    })
    this.drag.addEventListener('drag', e => {
      const callback = this.draggableObjects.get(e.object)
      callback && callback()
    })
  }
}
