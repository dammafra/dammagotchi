import { EquirectangularReflectionMapping, SRGBColorSpace } from 'three'
import Experience from '../experience'
import Debug from '../utils/debug'

export default class Environment {
  static debugName = '🏡 environment'

  constructor() {
    // Setup
    this.experience = Experience.instance
    this.debug = Debug.instance.gui.addFolder(Environment.debugName).close()

    this.scene = this.experience.scene
    this.resources = this.experience.resources

    this.setEnvironmentMap()
  }

  setEnvironmentMap() {
    const environmentMap = this.resources.items.environmentMapTexture
    environmentMap.mapping = EquirectangularReflectionMapping
    environmentMap.colorSpace = SRGBColorSpace

    this.scene.background = environmentMap

    this.scene.backgroundIntensity = 2
    this.scene.backgroundBlurriness = 0.1

    //prettier-ignore
    this.debug.add(this.scene, 'backgroundIntensity').min(0).max(10).step(0.1)
    this.debug.add(this.scene, 'backgroundBlurriness').min(0).max(1).step(0.001)
  }
}
