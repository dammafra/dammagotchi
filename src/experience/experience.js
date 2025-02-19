import { Scene } from 'three'
import Camera from './camera'
import sourcesConfig from './config/resources'
import Device from './device/device'
import Environment from './environment.js'
import Life from './life/life'
import Loading from './loading'
import Renderer from './renderer'
import Screen from './screen/screen.js'
import Tutorial from './tutorial.js'
import UI from './ui/ui.js'
import Pointer from './utils/pointer'
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

    // Options
    this.canvas = canvas

    // Setup
    this.time = new Time()
    this.sizes = new Sizes()
    this.resources = new Resources(sourcesConfig)
    this.loading = new Loading()

    this.scene = new Scene()
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.pointer = new Pointer()
    this.environment = new Environment()

    this.device = new Device()
    this.screen = new Screen()
    this.life = new Life()
    this.ui = new UI()

    this.tutorial = new Tutorial()

    // Events
    this.sizes.addEventListener('resize', this.resize)
    this.time.addEventListener('tick', this.update)
    this.time.addEventListener('tick-seconds', this.updateSeconds)
    this.resources.addEventListener('ready', this.readyResources)

    if (window.location.hash === '#debug') {
      this.debug = true

      import('./utils/debug.js').then(({ default: Debug }) => {
        this.debug = new Debug()

        for (const [key, value] of Object.entries(this)) {
          value.setDebug && value.setDebug(this.debug)
        }

        this.debug.loadState()
      })
    }
  }

  resize = () => {
    this.camera.resize()
    this.renderer.resize()
  }

  readyResources = async () => {
    this.resources.removeEventListener('ready', this.ready)

    this.environment.ready()
    this.screen.ready()
    this.ui.ready()
    this.loading.ready()

    if (!this.debug) {
      await this.camera.intro()
      this.tutorial.start()
    }
  }

  update = () => {
    this.loading.update()
    this.camera.update()
    this.renderer.update()
    this.screen.update()
    this.device.update()
  }

  updateSeconds = () => {
    this.life.updateSeconds()
  }
}
