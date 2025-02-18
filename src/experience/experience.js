import { EventDispatcher, Scene } from 'three'
import Camera from './camera'
import sourcesConfig from './config/resources'
import Device from './device/device'
import Life from './life/life'
import Loading from './loading'
import Renderer from './renderer'
import { Soundboard } from './ui/soundboard'
import Pointer from './utils/pointer'
import Resources from './utils/resources'
import Sizes from './utils/sizes'
import Time from './utils/time'

export default class Experience extends EventDispatcher {
  /** @type {Experience} */
  static instance

  static init(canvas) {
    return new Experience(canvas)
  }

  constructor(canvas) {
    super()

    // Singleton
    if (Experience.instance) {
      return Experience.instance
    }

    Experience.instance = this

    Time.init()
    Soundboard.init()

    // Options
    this.canvas = canvas

    // Setup
    this.loading = new Loading()

    this.time = Time.instance
    this.sizes = new Sizes()
    this.resources = new Resources(sourcesConfig)

    this.scene = new Scene()
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.pointer = new Pointer()
    this.device = new Device()

    // Events
    this.sizes.addEventListener('resize', this.resize)
    this.time.addEventListener('tick', this.update)
    this.time.addEventListener('tick-seconds', this.updateSeconds)
    this.resources.addEventListener('ready', this.readyResources)

    if (window.location.hash === '#debug') {
      this.debugActive = true

      import('./utils/debug.js').then(({ default: Debug }) => {
        this.debug = new Debug()
        this.dispatchEvent({ type: 'debug' })
      })
    }
  }

  resize = () => {
    this.camera.resize()
    this.renderer.resize()
  }

  readyResources = () => {
    this.resources.removeEventListener('ready', this.ready)

    this.life = new Life()
    this.life.addEventListener('ready', this.readyLife)
  }

  readyLife = () => {
    this.life.removeEventListener('ready', this.readyLife)

    this.device.ready()
    this.loading.ready()

    this.camera.animation()
    this.debug?.loadState()
  }

  update = () => {
    this.loading.update()
    this.camera.update()
    this.renderer.update()
    this.device.update()
  }

  updateSeconds = () => {
    if (this.life) this.life.updateSeconds()
  }
}
