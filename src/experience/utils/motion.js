import { degToRad } from 'three/src/math/MathUtils.js'
import Experience from '../experience'

export default class Motion {
  constructor() {
    this.experience = Experience.instance
    this.canvas = this.experience.canvas
    this.sizes = this.experience.sizes

    this.unit = 0.1
    this.gridSize = 20

    // Setup
    this.init()

    this.setupMousemove()

    if (typeof DeviceOrientationEvent !== 'undefined') {
      this.setupDeviceorientation()
    } else {
      this.setupTouchmove()
    }
  }

  init = () => {
    this.x = 0
    this.y = 0
  }

  setupMousemove() {
    this.canvas.addEventListener('mousemove', this.mousemove)
    this.canvas.addEventListener('mouseout', this.init)
  }

  mousemove = event => {
    this.x = event.offsetX / this.sizes.width - 0.5
    this.y = event.offsetY / this.sizes.height - 0.5
  }

  setupTouchmove() {
    this.canvas.addEventListener('touchmove', this.touchmove)
    this.canvas.addEventListener('touchend', this.init)
  }

  touchmove = event => {
    const touch = event.touches[0]
    const { left, top } = this.canvas.getBoundingClientRect()
    this.x = -((touch.clientX - left) / this.sizes.width - 0.5)
    this.y = -((touch.clientY - top) / this.sizes.height - 0.5)
  }

  setupDeviceorientation() {
    this.canvas.addEventListener('touchend', () => {
      if (typeof DeviceOrientationEvent.requestPermission !== 'function') {
        DeviceOrientationEvent.requestPermission = () => Promise.resolve('granted')
      }

      DeviceOrientationEvent.requestPermission().then(response => {
        if (response === 'granted') {
          window.addEventListener('deviceorientation', this.deviceorientation)
        } else {
          this.setupTouchmove()
        }
      })
    })
  }

  deviceorientation = event => {
    this.x = degToRad(event.gamma)
    this.y = degToRad(event.beta)
  }
}
