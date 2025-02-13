import { Scene } from 'three'
import Camera from './camera'
import sourcesConfig from './config/resources'
import Device from './device/device'
import Life from './life/life'
import Renderer from './renderer'
import Loading from './ui/loading'
import Debug from './utils/debug'
import Motion from './utils/motion'
import Resources from './utils/resources'
import Sizes from './utils/sizes'
import Time from './utils/time'

export default class Experience {
  /** @type {Experience} */
  static instance

  static init(canvas) {
    return new Experience(canvas)
  }

  constructor(canvas) {
    // Singleton
    if (Experience.instance) {
      return Experience.instance
    }

    Experience.instance = this

    Debug.init()
    Time.init()

    // Options
    this.canvas = canvas

    // Setup
    this.loading = new Loading()

    this.time = Time.instance
    this.sizes = new Sizes()
    this.motion = new Motion()
    this.resources = new Resources(sourcesConfig)

    this.scene = new Scene()
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.device = new Device()

    // Events
    this.sizes.addEventListener('resize', this.resize)
    this.time.addEventListener('tick', this.update)
    this.time.addEventListener('tick-seconds', this.updateSeconds)
    this.resources.addEventListener('ready', this.ready)
  }

  resize = () => {
    this.camera.resize()
    this.renderer.resize()
  }

  ready = () => {
    this.resources.removeEventListener('ready', this.ready)

    this.device.ready()

    this.life = new Life()
    this.life.addEventListener('ready', this.readyLife)
  }

  readyLife = () => {
    this.life.removeEventListener('ready', this.readyLife)

    this.loading.ready()

    this.camera.animation()
    Debug.instance.loadState()
  }

  update = () => {
    this.camera.update()
    this.renderer.update()
    this.device.update()
  }

  updateSeconds = () => {
    if (this.life) this.life.updateSeconds()
  }
}
