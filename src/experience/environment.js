import { Color, EquirectangularReflectionMapping, SRGBColorSpace } from 'three'
import Experience from './experience'
import Pixel from './life/pixel'
import Debug from './utils/debug'
import Time from './utils/time'

export default class Environment {
  static debugName = '🏡 environment'

  constructor() {
    // Setup
    this.experience = Experience.instance
    this.time = Time.instance
    this.debug = Debug.instance.gui?.addFolder({ title: Environment.debugName, expanded: false })

    this.scene = this.experience.scene
    this.resources = this.experience.resources

    this.setEnvironmentMap()
    this.setFlicker()
  }

  setEnvironmentMap() {
    const environmentMap = this.resources.items.environmentMapTexture
    environmentMap.mapping = EquirectangularReflectionMapping
    environmentMap.colorSpace = SRGBColorSpace

    this.scene.background = environmentMap

    this.backgroundIntensity = 2
    this.scene.backgroundIntensity = this.backgroundIntensity
    this.scene.backgroundBlurriness = 0.1

    this.debug?.addBinding(this.scene, 'backgroundIntensity', { min: 0, max: 10, step: 0.1 })
    this.debug?.addBinding(this.scene, 'backgroundBlurriness', { min: 0, max: 1, step: 0.001 })
  }

  setFlicker() {
    this.flicker = false
    this.flickerSpeed = 500

    this.debug?.addBinding(this, 'flicker')
    this.debug?.addBinding(this, 'flickerSpeed', { min: 1, max: 1000, step: 0.001 })
  }

  startFlicker() {
    this.flicker = true
  }

  stopFlicker() {
    this.flicker = false

    this.scene.backgroundIntensity = this.backgroundIntensity
    Pixel.material?.color.set(new Color('black'))
  }

  update() {
    if (!this.flicker) return

    const toggle = Math.floor(this.time.elapsed / this.flickerSpeed) % 2 === 0

    this.scene.backgroundIntensity = toggle ? this.backgroundIntensity : 0
    Pixel.material.color.set(new Color(toggle ? 'black' : 'white'))
  }
}
