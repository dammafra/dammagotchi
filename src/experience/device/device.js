import { Evaluator, SUBTRACTION } from 'three-bvh-csg'
import { radToDeg } from 'three/src/math/MathUtils.js'
import Experience from '../experience'
import Screen from '../screen/screen'
import Debug from '../utils/debug'
import Environment from './environment'
import Frame from './frame'
import Notch from './notch'
import Shell from './shell'

export default class Device {
  static debugName = '🥚 device'
  static evaluator = new Evaluator()

  config = {
    shell: {
      girth: 0.8,
      apex: 0.15,
      scaleZ: 0.5,
    },
    frames: [
      {
        radiusTop: 1,
        radiusBottom: 0.5,
        height: 0.5,
        positionX: 0,
        positionY: 0,
        positionZ: -0.5,
        rotationY: Math.PI * 0.25,
      },
      {
        radiusTop: 0.8,
        radiusBottom: 0.32,
        height: 0.24,
        positionX: 0.02,
        positionY: 0.04,
        positionZ: -0.37,
        rotationY: Math.PI * 0.05,
      },
    ],
    notch: {
      radius: 0.8,
      tube: 0.02,
      scaleY: 0.5,
      positionY: -0.02,
      rotationX: Math.PI * 0.5,
      cut: 1.1,
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
    this.shell = new Shell(this.config.shell)
    this.frames = this.config.frames.map(config => new Frame(config))
    this.notch = new Notch(this.config.notch)

    this.mesh = Device.evaluator.evaluate(this.shell.mesh, this.frames.at(0).mesh, SUBTRACTION)
    this.mesh = Device.evaluator.evaluate(this.mesh, this.frames.at(1).mesh, SUBTRACTION)
    this.mesh = Device.evaluator.evaluate(this.mesh, this.notch.mesh, SUBTRACTION)

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
    this.frames.forEach(f => f.dispose())
    this.notch.dispose()

    this.scene.remove(this.mesh)
  }

  setDebug() {
    this.debug = Debug.instance.gui?.addFolder({ title: Device.debugName })
    if (!this.debug) return

    const shellFolder = this.debug.addFolder({ title: 'shell', expanded: false })
    shellFolder.addBinding(this.config.shell, 'girth', { min: 0, max: 2, step: 0.001 })
    shellFolder.addBinding(this.config.shell, 'apex', { min: 0, max: 2, step: 0.001 })
    shellFolder.addBinding(this.config.shell, 'scaleZ', { min: 0, max: 2, step: 0.001 })

    const framesFolder = this.debug.addFolder({ title: 'frames', expanded: false })
    const framesTabs = framesFolder.addTab({
      pages: this.config.frames.map((_, i) => ({ title: `frame ${i + 1}` })),
    })
    framesTabs.pages.forEach((p, i) => {
      p.addBinding(this.config.frames[i], 'radiusTop', { min: 0, max: 10, step: 0.01 })
      p.addBinding(this.config.frames[i], 'radiusBottom', { min: 0, max: 10, step: 0.01 })
      p.addBinding(this.config.frames[i], 'height', { min: 0, max: 10, step: 0.01 })
      p.addBinding(this.config.frames[i], 'positionX', { min: -5, max: 5, step: 0.01 })
      p.addBinding(this.config.frames[i], 'positionY', { min: -5, max: 5, step: 0.01 })
      p.addBinding(this.config.frames[i], 'positionZ', { min: -5, max: 5, step: 0.01 })
      p.addBinding(this.config.frames[i], 'rotationY', { min: 0, max: Math.PI * 2, step: 0.1, format: radToDeg }) //prettier-ignore
    })

    const notchFolder = this.debug.addFolder({ title: 'notch', expanded: false })
    notchFolder.addBinding(this.config.notch, 'radius', { min: 0, max: 2, step: 0.001 })
    notchFolder.addBinding(this.config.notch, 'tube', { min: 0, max: 2, step: 0.001 })
    notchFolder.addBinding(this.config.notch, 'scaleY', { min: 0, max: 2, step: 0.001 })
    notchFolder.addBinding(this.config.notch, 'positionY', { min: -5, max: 5, step: 0.01 })
    notchFolder.addBinding(this.config.notch, 'rotationX', { min: 0, max: Math.PI * 2, step: 0.1, format: radToDeg }) //prettier-ignore
    notchFolder.addBinding(this.config.notch, 'cut', { min: 0, max: 5, step: 0.001 })

    this.debug.on('change', () => {
      this.dispose()
      this.setMesh()
    })
  }
}
