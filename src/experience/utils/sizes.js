import Experience from '../experience'

export default class Sizes {
  constructor() {
    this.experience = Experience.instance
    this.canvas = this.experience.canvas

    // Setup
    this.setup()
  }

  setup() {
    const { width, height } = this.canvas.getBoundingClientRect()

    this.width = width
    this.height = height
    this.aspectRatio = width / height
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)
  }

  resize() {
    this.setup()
  }
}
