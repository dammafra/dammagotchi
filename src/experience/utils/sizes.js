import { EventDispatcher } from 'three'
import Experience from '../experience'

export default class Sizes extends EventDispatcher {
  constructor() {
    super()

    this.experience = Experience.instance
    this.canvas = this.experience.canvas

    // Setup
    this.unit = 0.1
    this.gridSize = 24

    this.setup()

    // Resize event
    window.addEventListener('resize', this.resize)
  }

  setup() {
    const { width, height } = this.canvas.getBoundingClientRect()

    this.width = width
    this.height = height
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)
  }

  resize = () => {
    this.setup()
    this.dispatchEvent({ type: 'resize' })
  }

  destroy() {
    window.removeEventListener('resize', this.resize)
  }
}
