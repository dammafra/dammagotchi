import { AxesHelper, GridHelper } from 'three'
import Experience from '../experience'
import Debug from '../utils/debug'
import { dispose } from '../utils/dispose'

export default class Floor {
  constructor(unit) {
    // Setup
    this.experience = Experience.instance
    this.debug = Debug.instance.addFolder('floor')

    this.scene = this.experience.scene

    this.size = 20
    this.create()

    //prettier-ignore
    this.debug.add(this, 'size').min(10).max(100).step(1).onChange(() => {
      this.destroy()
      this.create()
    })
  }

  create() {
    this.gridHelper = new GridHelper(this.size, this.size * (1 / 0.5))

    this.axesHelper = new AxesHelper(this.size / 2)
    this.axesHelper
    this.axesHelper.position.set(0.001, 0.001, 0.001)

    this.scene.add(this.gridHelper, this.axesHelper)
  }

  destroy() {
    dispose(this.gridHelper)
    dispose(this.axesHelper)
    this.scene.remove(this.gridHelper, this.axesHelper)
  }
}
