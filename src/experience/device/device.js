import { Evaluator, SUBTRACTION } from 'three-bvh-csg'
import Experience from '../experience'
import Screen from '../screen/screen'
import Debug from '../utils/debug'
import Environment from './environment'
import Frame from './frame'
import Shell from './shell'

export default class Device {
  static debugName = '🥚 device'

  config = {
    shell: {
      girth: 0.8,
      apex: 0.15,
      scaleZ: 0.5,
    },
    frame: {
      radiusTop: 1,
      radiusBottom: 0.5,
      height: 0.5,
      positionX: 0,
      positionY: 0,
      positionZ: -0.5,
    },
  }

  constructor() {
    this.experience = Experience.instance
    this.scene = this.experience.scene

    this.screen = new Screen()

    this.setMesh()
    this.setDebug()
  }

  setMesh() {
    const evaluator = new Evaluator()

    this.shell = new Shell(this.config.shell)
    this.frame = new Frame(this.config.frame)

    this.mesh = evaluator.evaluate(this.shell.mesh, this.frame.mesh, SUBTRACTION)
    this.scene.add(this.mesh)
  }

  ready() {
    this.environment = new Environment()
    this.screen.ready()
  }

  update() {
    this.screen.update()
  }

  dispose() {
    this.shell.dispose()
    this.frame.dispose()

    this.scene.remove(this.mesh)
  }

  setDebug() {
    this.debug = Debug.instance.gui?.addFolder({ title: Device.debugName })
    if (!this.debug) return

    const shellFolder = this.debug.addFolder({ title: 'shell' })
    shellFolder.addBinding(this.config.shell, 'girth', { min: 0, max: 2, step: 0.001 })
    shellFolder.addBinding(this.config.shell, 'apex', { min: 0, max: 2, step: 0.001 })
    shellFolder.addBinding(this.config.shell, 'scaleZ', { min: 0, max: 2, step: 0.001 })

    const frameFolder = this.debug.addFolder({ title: 'frame' })
    frameFolder.addBinding(this.config.frame, 'radiusTop', { min: 0, max: 10, step: 0.01 })
    frameFolder.addBinding(this.config.frame, 'radiusBottom', { min: 0, max: 10, step: 0.01 })
    frameFolder.addBinding(this.config.frame, 'height', { min: 0, max: 10, step: 0.01 })
    frameFolder.addBinding(this.config.frame, 'positionX', { min: -5, max: 5, step: 0.01 })
    frameFolder.addBinding(this.config.frame, 'positionY', { min: -5, max: 5, step: 0.01 })
    frameFolder.addBinding(this.config.frame, 'positionZ', { min: -5, max: 5, step: 0.01 })

    this.debug.on('change', () => {
      this.dispose()
      this.setMesh()
    })
  }
}
