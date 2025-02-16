import { Raycaster, Vector2 } from 'three'
import Experience from '../experience'

export default class Pointer {
  constructor() {
    this.experience = Experience.instance
    this.sizes = this.experience.sizes
    this.camera = this.experience.camera

    this.raycaster = new Raycaster()
    this.objectsToTest = new Map()
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

    const callback = this.objectsToTest.get(this.currentIntersect?.object)
    callback && callback()
  }

  onClick(object, callback) {
    this.objectsToTest.set(object, callback)
  }

  updateRaycaster() {
    this.raycaster.setFromCamera(new Vector2(this.x, this.y), this.camera.instance)

    const test = Array.from(this.objectsToTest.keys())
    const intersects = this.raycaster.intersectObjects(test)
    this.currentIntersect = intersects.length ? intersects[0] : null
  }
}
