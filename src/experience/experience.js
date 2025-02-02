import { Scene } from 'three'
import Camera from './camera'
import Frame from './frame'
import Renderer from './renderer'
import sources from './sources'
import Debug from './utils/debug'
import { dispose } from './utils/dispose'
import Grid from './utils/grid'
import Motion from './utils/motion'
import Resources from './utils/resources'
import Sizes from './utils/sizes'
import Time from './utils/time'
import World from './world/world'

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

    // Options
    this.canvas = canvas

    // Setup
    this.time = new Time()

    this.frame = new Frame()
    this.sizes = new Sizes()
    this.grid = new Grid()
    this.motion = new Motion()
    this.resources = new Resources(sources)

    this.scene = new Scene()
    this.camera = new Camera()
    this.renderer = new Renderer()

    this.world = new World()

    // Events
    this.frame.addEventListener('resize', this.resize)
    this.time.addEventListener('tick', this.update)
    this.time.addEventListener('tick-seconds', this.updaSeconds)
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

  updaSeconds = () => {
    this.world.updateSeconds()
  }

  ready = () => {
    this.world.ready()
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
