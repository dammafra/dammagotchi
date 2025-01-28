import { EventDispatcher } from 'three'

export default class Sizes extends EventDispatcher {
  constructor() {
    super()

    // Setup
    this.unit = 0.1
    this.gridSize = 24

    this.setup()

    // Resize event
    window.addEventListener('resize', this.resize)
  }

  setup() {
    this.width = window.innerWidth
    this.height = window.innerHeight
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
