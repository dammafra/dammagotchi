import { Raycaster, Vector2 } from 'three'
import { DragControls } from 'three/addons/controls/DragControls.js'
import Experience from '../experience'

export default class Pointer {
  #enabled = false

  set enabled(value) {
    this.#enabled = value
    this.drag.enabled = value
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

    // Setup
    this.x = 0
    this.y = 0

    this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    this.isTouchDevice
      ? window.addEventListener('touchend', this.touchend)
      : window.addEventListener('click', this.click)
  }

  touchend = event => {
    const touch = event.changedTouches[0]
    this.click(touch)
  }

  click = event => {
    this.x = (event.clientX / this.sizes.width) * 2 - 1
    this.y = -((event.clientY / this.sizes.height) * 2 - 1)

    this.updateRaycaster()

    if (this.#enabled) {
      const callback = this.clickableObjects.get(this.currentIntersect?.object)
      callback && callback()
    }
  }

  onClick(object, callback) {
    this.clickableObjects.set(object, callback)
  }

  cancelClicl(object) {
    this.clickableObjects.delete(object)
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
    this.drag.enabled = this.#enabled

    this.drag.addEventListener('dragstart', () => (this.camera.controls.enabled = false))
    this.drag.addEventListener('dragend', () => (this.camera.controls.enabled = true))
    this.drag.addEventListener('drag', e => {
      const callback = this.draggableObjects.get(e.object)
      callback && callback()
    })
  }

  updateRaycaster() {
    this.raycaster.setFromCamera(new Vector2(this.x, this.y), this.camera.instance)

    const test = Array.from(this.clickableObjects.keys())
    const intersects = this.raycaster.intersectObjects(test)
    this.currentIntersect = intersects.length ? intersects[0] : null
  }
}
