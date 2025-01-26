import { Scene } from 'three'
import Camera from './camera'
import Renderer from './renderer'
import sources from './sources'
import Debug from './utils/debug'
import { dispose } from './utils/dispose'
import Mouse from './utils/mouse'
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

    // Options
    this.canvas = canvas

    // Setup
    this.sizes = new Sizes()
    this.time = new Time()
    this.mouse = new Mouse()
    this.scene = new Scene()
    this.resources = new Resources(sources)
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.world = new World()

    // Events
    this.sizes.addEventListener('resize', this.resize)
    this.time.addEventListener('tick', this.update)

    if (Debug.active) {
      // Global access
      window.Experience = Experience
    }
  }

  resize = () => {
    this.camera.resize()
    this.renderer.resize()
  }

  update = () => {
    this.camera.update()
    this.world.update()
    this.renderer.update()
  }

  destroy() {
    this.sizes.removeEventListener('resize', this.resize)
    this.sizes.destroy()

    this.time.removeEventListener('tick', this.update)
    this.time.destroy()

    this.mouse.destroy()

    this.scene.traverse(dispose)

    this.camera.controls.dispose()
    this.renderer.instance.dispose()

    Debug.instance.destroy()
    Experience.instance = null
  }
}
