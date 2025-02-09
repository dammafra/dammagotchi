import { Color, EquirectangularReflectionMapping, SRGBColorSpace } from 'three'
import Experience from '../experience'
import Debug from '../utils/debug'
import Time from '../utils/time'
import Pixel from './pixel'

export default class Environment {
  static debugName = '🏡 environment'

  constructor() {
    this.time = Time.instance

    // Setup
    this.experience = Experience.instance
    this.debug = Debug.instance.gui?.addFolder({ title: Environment.debugName, expanded: false })

    this.backgroundIntensity = 2
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    this.setEnvironmentMap()
  }

  setEnvironmentMap() {
    const environmentMap = this.resources.items.environmentMapTexture
    environmentMap.mapping = EquirectangularReflectionMapping
    environmentMap.colorSpace = SRGBColorSpace

    this.scene.background = environmentMap

    this.scene.backgroundIntensity = this.backgroundIntensity
    this.scene.backgroundBlurriness = 0.1

    this.debug?.addBinding(this.scene, 'backgroundIntensity', { min: 0, max: 10, step: 0.1 })
    this.debug?.addBinding(this.scene, 'backgroundBlurriness', { min: 0, max: 1, step: 0.001 })
  }

  startFlicker() {
    this.flicker = true

    this.scene.backgroundIntensity = 0
    Pixel.material?.color.set(new Color('white'))
  }

  stopFlicker() {
    this.flicker = false

    this.scene.backgroundIntensity = this.backgroundIntensity
    Pixel.material?.color.set(new Color('black'))
  }

  updateSeconds() {
    if (!this.flicker) return

    this.scene.backgroundIntensity =
      this.scene.backgroundIntensity === 0 ? this.backgroundIntensity : 0
    Pixel.material.color.set(new Color(this.scene.backgroundIntensity === 0 ? 'white' : 'black'))
  }
}
