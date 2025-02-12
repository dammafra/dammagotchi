import { Scene } from 'three'
import Camera from './camera'
import sourcesConfig from './config/resources'
import Environment from './environment'
import Life from './life/life'
import Renderer from './renderer'
import Room from './room'
import Loading from './ui/loading'
import Debug from './utils/debug'
import Grid from './utils/grid'
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
    this.grid = new Grid()
    this.motion = new Motion()
    this.resources = new Resources(sourcesConfig)

    this.scene = new Scene()
    this.camera = new Camera()
    this.renderer = new Renderer()

    // Events
    this.sizes.addEventListener('resize', this.resize)
    this.time.addEventListener('tick', this.update)
    this.time.addEventListener('tick-seconds', this.updateSeconds)
    this.resources.addEventListener('ready', this.readyResources)
  }

  resize = () => {
    this.camera.resize()
    this.renderer.resize()
  }

  update = () => {
    this.camera.update()
    this.renderer.update()
    if (this.environment) this.environment.update()
  }

  updateSeconds = () => {
    if (this.life) this.life.updateSeconds()
  }

  readyResources = () => {
    this.resources.removeEventListener('ready', this.readyResources)

    this.environment = new Environment()
    this.room = new Room()
    this.life = new Life()

    this.life.addEventListener('ready', this.readyLife)
  }

  readyLife = () => {
    this.life.removeEventListener('ready', this.readyLife)

    this.loading.ready()
    Debug.instance.loadState()
  }
}
