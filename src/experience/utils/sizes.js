import { EventDispatcher, Vector3 } from 'three'
import Experience from '../experience'

export default class Sizes extends EventDispatcher {
  constructor() {
    super()

    this.experience = Experience.instance
    this.canvas = this.experience.canvas

    // Setup
    this.setup()
    this.setGrid()

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

  setGrid() {
    this.unit = 0.1
    this.gridSize = 24

    const zeroCoordinate = this.unit / 2
    this.gridCenter = new Vector3(
      zeroCoordinate,
      zeroCoordinate,
      zeroCoordinate - this.gridSize / 4,
    )
  }

  destroy() {
    window.removeEventListener('resize', this.resize)
  }
}
