import { AxesHelper, GridHelper } from 'three'
import Experience from '../experience'
import Debug from '../utils/debug'
import { dispose } from '../utils/dispose'

export default class Floor {
  constructor(unit) {
    // Setup
    this.experience = Experience.instance
    this.debug = Debug.instance.addFolder('floor')

    this.size = 20
    this.scene = this.experience.scene

    //prettier-ignore
    this.debug.add(this, 'size').min(10).max(50).step(1).onChange(() => {
      this.destroy()
      this.create()
    })

    this.create()
  }

  create() {
    this.gridHelper = new GridHelper(this.size, this.size * (1 / 0.5))

    this.axesHelper = new AxesHelper(this.size / 2)
    this.axesHelper.visible = Debug.active
    this.axesHelper.position.set(0.001, 0.001, 0.001)

    this.scene.add(this.gridHelper, this.axesHelper)

    this.debug.add(this.axesHelper, 'visible').name('axesHelper')
  }

  destroy() {
    dispose(this.gridHelper)
    dispose(this.axesHelper)
    this.debug.controllers.find(c => c._name === 'axesHelper')?.destroy()
    this.scene.remove(this.gridHelper, this.axesHelper)
  }
}
