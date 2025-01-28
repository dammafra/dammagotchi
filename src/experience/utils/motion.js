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

    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
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
    this.x = event.clientX / this.sizes.width - 0.5
    this.y = event.clientY / this.sizes.height - 0.5
  }

  setupTouchmove() {
    this.canvas.addEventListener('touchmove', this.touchmove)
    this.canvas.addEventListener('touchend', this.init)
  }

  touchmove = event => {
    const touch = event.touches[0]
    this.x = -(touch.clientX / this.sizes.width - 0.5)
    this.y = -(touch.clientY / this.sizes.height - 0.5)
  }

  setupDeviceorientation() {
    this.canvas.addEventListener('touchend', () =>
      DeviceOrientationEvent.requestPermission().then(response => {
        if (response === 'granted') {
          window.addEventListener('deviceorientation', this.deviceorientation)
        } else {
          this.setupTouchmove()
        }
      }),
    )
  }

  deviceorientation = event => {
    this.x = this.degreesToRads(event.gamma)
    this.y = this.degreesToRads(event.beta)
  }

  degreesToRads = deg => (deg * Math.PI) / 180.0

  destroy() {
    this.canvas.removeEventListener('mousemove', this.mousemove)
    this.canvas.removeEventListener('mouseout', this.init)

    this.canvas.removeEventListener('touchmove', this.touchmove)
    this.canvas.removeEventListener('touchend', this.init)

    window.removeEventListener('deviceorientation', this.deviceorientation)
  }
}
