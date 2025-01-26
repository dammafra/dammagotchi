import { EquirectangularReflectionMapping, SRGBColorSpace } from 'three'
import Experience from '../experience'
import Debug from '../utils/debug'

export default class Environment {
  constructor() {
    // Setup
    this.experience = Experience.instance
    this.debug = Debug.instance.addFolder('environment')

    this.scene = this.experience.scene
    this.resources = this.experience.resources

    this.intensity = 2
    this.blurriness = 0.1

    this.setEnvironmentMap()
  }

  setEnvironmentMap() {
    const environmentMap = this.resources.items.environmentMapTexture
    environmentMap.mapping = EquirectangularReflectionMapping
    environmentMap.colorSpace = SRGBColorSpace

    this.scene.background = environmentMap
    this.scene.environment = environmentMap

    this.setIntensity()
    this.setBlurriness()

    //prettier-ignore
    this.debug.add(this, 'intensity').min(0).max(10).step(0.1).onChange(this.setIntensity)
    this.debug.add(this, 'blurriness').min(0).max(1).step(0.001).onChange(this.setBlurriness)
  }

  setIntensity = () => {
    this.scene.backgroundIntensity = this.intensity
    this.scene.environmentIntensity = this.intensity
  }

  setBlurriness = () => {
    this.scene.backgroundBlurriness = this.blurriness
  }
}
