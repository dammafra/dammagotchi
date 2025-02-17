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
    this.life = this.experience.life

    this.flicker = false
    this.flickerSpeed = 2

    this.setEnvironmentMap()

    this.life.addEventListener('start-evolving', e => this.setFlicker(e.flicker))
    this.life.addEventListener('end-evolving', e => this.setFlicker(e.flicker))
  }

  setEnvironmentMap() {
    const environmentMap = this.resources.items.screenBackground
    environmentMap.colorSpace = SRGBColorSpace

    this.scene.background = environmentMap

    this.backgroundIntensity = 0.5
    this.scene.backgroundIntensity = this.backgroundIntensity
  }

  setFlicker(value) {
    this.flicker = value

    if (!this.flicker) {
      this.scene.backgroundIntensity = this.backgroundIntensity
      Pixel.material?.color.set(new Color('black'))
    }
  }

  update() {
    if (!this.flicker) return

    const toggle = Math.floor(this.time.elapsed * this.time.speed * this.flickerSpeed) % 2 === 0

    this.scene.backgroundIntensity = toggle ? this.backgroundIntensity : 0.05
    Pixel.material.color.set(new Color(toggle ? 'black' : 'white'))
  }
}
