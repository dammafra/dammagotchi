import Experience from '../experience'

export default class Pointer {
  constructor() {
    this.experience = Experience.instance
    this.canvas = this.experience.canvas
    this.sizes = this.experience.sizes

    this.unit = 0.1
    this.gridSize = 20

    // Setup
    this.init()

    // Resize event
    this.canvas.addEventListener('mousemove', this.mousemove)
    this.canvas.addEventListener('mouseout', this.init)

    this.canvas.addEventListener('touchmove', this.touchmove)
    this.canvas.addEventListener('touchend', this.init)
  }

  init = () => {
    this.x = 0
    this.y = 0
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
    this.canvas.removeEventListener('mousemove', this.mousemove)
    this.canvas.removeEventListener('touchmove', this.touchmove)
  }
}
