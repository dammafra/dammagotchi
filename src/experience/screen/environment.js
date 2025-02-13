import { Color, SRGBColorSpace } from 'three'
import Experience from '../experience'
import Time from '../utils/time'
import Pixel from './pixel'

export default class ScreenEnvironment {
  constructor() {
    // Setup
    this.experience = Experience.instance
    this.time = Time.instance

    this.scene = this.experience.device.screen.scene
    this.resources = this.experience.resources

    this.setEnvironmentMap()
    this.setFlicker()
  }

  setEnvironmentMap() {
    const environmentMap = this.resources.items.screenBackground
    environmentMap.colorSpace = SRGBColorSpace

    this.scene.background = environmentMap

    this.backgroundIntensity = 0.5
    this.scene.backgroundIntensity = this.backgroundIntensity
  }

  setFlicker() {
    this.flicker = false
    this.flickerSpeed = 2
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

    const toggle = Math.floor(this.time.elapsed * this.flickerSpeed) % 2 === 0

    this.scene.backgroundIntensity = toggle ? this.backgroundIntensity : 0.05
    Pixel.material.color.set(new Color(toggle ? 'black' : 'white'))
  }
}
