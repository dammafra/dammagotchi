import Experience from '@experience'
import { Raycaster, Vector2 } from 'three'
import { DragControls } from 'three/addons/controls/DragControls.js'

export default class Pointer {
  constructor() {
    this.experience = Experience.instance
    this.canvas = this.experience.canvas
    this.sizes = this.experience.sizes
    this.camera = this.experience.camera

    this.raycaster = new Raycaster()
    this.clickableObjects = new Map()
    this.draggableObjects = new Map()
    this.currentIntersect = null

    // Setup
    this.x = 0
    this.y = 0

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouchDevice) {
      window.addEventListener('touchstart', this.touchstart)
      window.addEventListener('touchend', this.mouseup)
    } else {
      window.addEventListener('mousedown', this.mousedown)
      window.addEventListener('mouseup', this.mouseup)
    }
  }

  touchstart = event => {
    const touch = event.changedTouches[0]
    this.mousedown(touch)
  }

  mousedown = event => {
    if (event.target !== this.canvas) return

    this.clientX = event.clientX
    this.clientY = event.clientY

    this.x = (event.clientX / this.sizes.width) * 2 - 1
    this.y = -((event.clientY / this.sizes.height) * 2 - 1)

    this.updateRaycaster()

    const callback = this.clickableObjects.get(this.currentIntersect)
    if (callback && callback.start) {
      callback.start()
      this.camera.controls.enabled = false
    }
  }

  mouseup = () => {
    const callback = this.clickableObjects.get(this.currentIntersect)
    if (callback && callback.end) {
      callback.end()
      this.camera.controls.enabled = true
    }
  }

  updateRaycaster() {
    this.raycaster.setFromCamera(new Vector2(this.x, this.y), this.camera.instance)

    const test = Array.from(this.clickableObjects.keys())
    const intersects = this.raycaster.intersectObjects(test)
    this.currentIntersect = intersects.length ? intersects[0].object : null
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

    this.drag.addEventListener('dragstart', () => (this.camera.controls.enabled = false))
    this.drag.addEventListener('dragend', () => (this.camera.controls.enabled = true))
    this.drag.addEventListener('drag', e => {
      const callback = this.draggableObjects.get(e.object)
      callback && callback()
    })
  }
}
