import { GridHelper } from 'three'
import Experience from '../experience'
import Debug from '../utils/debug'

export default class Floor {
  constructor() {
    // Setup
    this.experience = Experience.instance
    this.debug = Debug.instance.addFolder('floor')

    this.scene = this.experience.scene
    this.sizes = this.experience.sizes

    this.gridHelper = new GridHelper(
      this.sizes.gridSize,
      this.sizes.gridSize * (1 / this.sizes.unit),
    )

    this.scene.add(this.gridHelper)
  }
}
