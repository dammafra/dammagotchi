import { Scene } from 'three'
import Camera from './camera'
import sourcesConfig from './config/resources'
import Life from './life/life'
import Renderer from './renderer'
import Frame from './ui/frame'
import Loading from './ui/loading'
import Debug from './utils/debug'
import { dispose } from './utils/dispose'
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
    this.frame = new Frame()

    this.time = Time.instance
    this.sizes = new Sizes()
    this.grid = new Grid()
    this.motion = new Motion()
    this.resources = new Resources(sourcesConfig)

    this.scene = new Scene()
    this.camera = new Camera()
    this.renderer = new Renderer()

    this.life = new Life()

    // Events
    this.frame.addEventListener('resize', this.resize)
    this.time.addEventListener('tick', this.update)
    this.time.addEventListener('tick-seconds', this.updateSeconds)
    this.resources.addEventListener('ready', this.ready)
  }

  resize = () => {
    this.sizes.resize()
    this.camera.resize()
    this.renderer.resize()
  }

  update = () => {
    this.frame.update()
    this.camera.update()
    this.renderer.update()
  }

  updateSeconds = () => {
    this.life.updateSeconds()
  }

  ready = () => {
    this.loading.ready()
    this.life.ready()
    Debug.instance.loadState()
  }

  destroy() {
    this.frame.removeEventListener('resize', this.resize)
    this.frame.destroy()

    this.time.removeEventListener('tick', this.update)
    this.time.removeEventListener('tick-seconds', this.update)
    this.time.destroy()

    this.resources.removeEventListener('ready', this.ready)

    this.motion.destroy()

    this.scene.traverse(dispose)

    this.camera.controls.dispose()
    this.renderer.instance.dispose()

    Debug.instance.destroy()
    Experience.instance = null
  }
}
