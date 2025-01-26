import Experience from '../experience'

export default class Pointer {
  constructor() {
    this.experience = Experience.instance
    this.sizes = this.experience.sizes

    this.unit = 0.1
    this.gridSize = 20

    // Setup
    this.x = 0
    this.y = 0

    // Resize event
    window.addEventListener('mousemove', this.mousemove)
    window.addEventListener('touchmove', this.touchmove)
  }

  mousemove = event => {
    this.x = event.clientX / this.sizes.width - 0.5
    this.y = event.clientY / this.sizes.height - 0.5
  }

  touchmove = event => {
    const touch = event.touches[0]
    this.x = touch.clientX / this.sizes.width - 0.5
    this.y = touch.clientY / this.sizes.height - 0.5
  }

  destroy() {
    window.removeEventListener('mousemove', this.mousemove)
    window.removeEventListener('touchmove', this.touchmove)
  }
}
