import { EventDispatcher } from 'three'
import { Evaluator, SUBTRACTION } from 'three-bvh-csg'
import { radToDeg } from 'three/src/math/MathUtils.js'
import Experience from '../experience'
import Screen from '../screen/screen'
import UI from '../ui/ui'
import Debug from '../utils/debug'
import Button from './button'
import ButtonSlot from './button-slot'
import Environment from './environment'
import Frame from './frame'
import Notch from './notch'
import Shell from './shell'
import Tab from './tab'

export default class Device extends EventDispatcher {
  static debugName = '🥚 device'
  static evaluator = new Evaluator()

  config = {
    shell: {
      girth: 0.8,
      apex: 0.1,
      scale: { x: 1, y: 1, z: 0.5 },
    },
    frames: [
      {
        radiusTop: 1,
        radiusBottom: 0.5,
        height: 0.5,
        position: { x: 0, y: 0, z: -0.5 },
        rotation: { x: -Math.PI * 0.5, y: Math.PI * 0.25, z: 0 },
      },
      {
        radiusTop: 0.8,
        radiusBottom: 0.32,
        height: 0.24,
        position: { x: 0.02, y: 0.04, z: -0.37 },
        rotation: { x: -Math.PI * 0.5, y: Math.PI * 0.05, z: 0 },
      },
    ],
    notch: {
      radius: 0.8,
      tube: 0.02,
      scale: { x: 1, y: 0.5, z: 1 },
      position: { x: 0, y: -0.02, z: 0 },
      rotation: { x: Math.PI * 0.5, y: 0, z: 0 },
      cut: 1.1,
    },
    buttonSlots: [
      { radius: 0.1, position: { x: 0.3, y: -0.6, z: -0.3 } },
      { radius: 0.1, position: { x: 0, y: -0.7, z: -0.3 } },
      { radius: 0.1, position: { x: -0.3, y: -0.6, z: -0.3 } },
      { radius: 0.05, position: { x: -0.3, y: -0.6, z: 0.3 } },
    ],
    buttons: [
      {
        radius: 0.09,
        scale: { x: 1, y: 1, z: 0.5 },
        rotation: { x: -Math.PI * 0.1, y: -Math.PI * 0.1, z: 0 },
        position: { x: 0.3, y: -0.6, z: -0.3 },
        color: '#996600',
        onClick: () => this.dispatchEvent({ type: 'button-A' }),
      },
      {
        radius: 0.09,
        scale: { x: 1, y: 1, z: 0.5 },
        rotation: { x: -Math.PI * 0.15, y: 0, z: 0 },
        position: { x: 0, y: -0.7, z: -0.3 },
        color: '#996600',
        onClick: () => this.dispatchEvent({ type: 'button-B' }),
      },
      {
        radius: 0.09,
        scale: { x: 1, y: 1, z: 0.5 },
        rotation: { x: -Math.PI * 0.1, y: Math.PI * 0.1, z: 0 },
        position: { x: -0.3, y: -0.6, z: -0.3 },
        color: '#996600',
        onClick: () => this.dispatchEvent({ type: 'button-C' }),
      },
      {
        radius: 0.0405,
        scale: { x: 1, y: 1, z: 0.5 },
        rotation: { x: Math.PI * 0.1, y: -Math.PI * 0.1, z: 0 },
        position: { x: -0.3, y: -0.6, z: 0.28 },
        color: 'gray',
        onClick: () => this.dispatchEvent({ type: 'reset-button' }),
      },
    ],
    tab: {
      width: 0.8,
      height: 0.3,
      position: { x: -0.6, y: -0.3, z: 0 },
      visible: false,
      onClick: () => this.dispatchEvent({ type: 'tab' }),
    },
  }

  constructor() {
    super()

    this.experience = Experience.instance
    this.scene = this.experience.scene
    this.pointer = this.experience.pointer
    this.screen = new Screen()

    this.setDebug()
  }

  setMesh() {
    this.shell = new Shell(this.config.shell)
    this.frames = this.config.frames.map(config => new Frame(config))
    this.notch = new Notch(this.config.notch)
    this.buttonSlots = this.config.buttonSlots.map(config => new ButtonSlot(config))

    this.mesh = this.frames.reduce(
      (result, frame) => Device.evaluator.evaluate(result, frame.mesh, SUBTRACTION),
      this.shell.mesh,
    )
    this.mesh = Device.evaluator.evaluate(this.mesh, this.notch.mesh, SUBTRACTION)
    this.mesh = this.buttonSlots.reduce(
      (result, buttonSlot) => Device.evaluator.evaluate(result, buttonSlot.mesh, SUBTRACTION),
      this.mesh,
    )
    this.mesh.castShadow = true
    this.mesh.receiveShadow = true

    this.pointer.onClick(this.mesh)

    this.buttons = this.config.buttons.map(config => new Button(config))
    this.tab = new Tab(this.config.tab)

    this.scene.add(this.mesh, ...this.buttons.map(b => b.mesh), this.tab.mesh)
  }

  setEnvironment() {
    this.environment = new Environment()
  }

  setUI() {
    this.ui = new UI()
  }

  ready() {
    this.setMesh()
    this.setEnvironment()
    this.setUI()
    this.screen.ready()
  }

  update() {
    this.screen.update()
  }

  dispose() {
    this.shell.dispose()
    this.frames.forEach(f => f.dispose())
    this.notch.dispose()
    this.buttonSlots.forEach(bs => bs.dispose())
    this.tab.dispose()

    this.scene.remove(this.mesh, ...this.buttons.map(b => b.mesh), this.tab.mesh)
  }

  setDebug() {
    this.debug = Debug.instance.gui?.addFolder({ title: Device.debugName, expanded: false })
    if (!this.debug) return

    const shellFolder = this.debug.addFolder({ title: 'shell', expanded: false })
    shellFolder.addBinding(this.config.shell, 'girth', { min: 0, max: 2, step: 0.01 })
    shellFolder.addBinding(this.config.shell, 'apex', { min: 0, max: 2, step: 0.01 })
    shellFolder.addBinding(this.config.shell, 'scale', { min: 0, max: 2, step: 0.01 })

    const framesFolder = this.debug.addFolder({ title: 'frames', expanded: false })
    const framesTabs = framesFolder.addTab({
      pages: this.config.frames.map((_, i) => ({ title: `frame ${i + 1}` })),
    })
    framesTabs.pages.forEach((p, i) => {
      p.addBinding(this.config.frames[i], 'radiusTop', { min: 0, max: 10, step: 0.01 })
      p.addBinding(this.config.frames[i], 'radiusBottom', { min: 0, max: 10, step: 0.01 })
      p.addBinding(this.config.frames[i], 'height', { min: 0, max: 10, step: 0.01 })
      p.addBinding(this.config.frames[i], 'position', { min: -2, max: 2, step: 0.01 })
      p.addBinding(this.config.frames[i], 'rotation', { step: 0.1, format: radToDeg })
    })

    const notchFolder = this.debug.addFolder({ title: 'notch', expanded: false })
    notchFolder.addBinding(this.config.notch, 'radius', { min: 0, max: 2, step: 0.01 })
    notchFolder.addBinding(this.config.notch, 'tube', { min: 0, max: 2, step: 0.01 })
    notchFolder.addBinding(this.config.notch, 'scale', { min: 0, max: 2, step: 0.01 })
    notchFolder.addBinding(this.config.notch, 'position', { min: -2, max: 2, step: 0.01 })
    notchFolder.addBinding(this.config.notch, 'rotation', { step: 0.1, format: radToDeg })
    notchFolder.addBinding(this.config.notch, 'cut', { min: 0, max: 5, step: 0.01 })

    const buttonSlotsFolder = this.debug.addFolder({ title: 'button slots', expanded: false })
    const buttonSlotsTabs = buttonSlotsFolder.addTab({
      pages: this.config.buttonSlots.map((_, i) => ({ title: `slot ${i + 1}` })),
    })
    buttonSlotsTabs.pages.forEach((p, i) => {
      p.addBinding(this.config.buttonSlots[i], 'radius', { min: 0, max: 2, step: 0.01 })
      p.addBinding(this.config.buttonSlots[i], 'position', { min: -2, max: 2, step: 0.01 })
    })

    const buttonsFolder = this.debug.addFolder({ title: 'buttons', expanded: false })
    const buttonsTabs = buttonsFolder.addTab({
      pages: this.config.buttons.map((_, i) => ({ title: `button ${i + 1}` })),
    })
    buttonsTabs.pages.forEach((p, i) => {
      p.addBinding(this.config.buttons[i], 'radius', { min: 0, max: 2, step: 0.01 })
      p.addBinding(this.config.buttons[i], 'scale', { min: 0, max: 2, step: 0.01 })
      p.addBinding(this.config.buttons[i], 'position', { min: -2, max: 2, step: 0.01 })
      p.addBinding(this.config.buttons[i], 'rotation', { step: 0.1, format: radToDeg })
    })

    const tabFolder = this.debug.addFolder({ title: 'tab', expanded: false })
    tabFolder.addBinding(this.config.tab, 'width', { min: 0, max: 2, step: 0.01 })
    tabFolder.addBinding(this.config.tab, 'height', { min: 0, max: 2, step: 0.01 })
    tabFolder.addBinding(this.config.tab, 'position', { min: -2, max: 2, step: 0.01 })
    tabFolder.addBinding(this.config.tab, 'visible')

    this.debug.on('change', () => {
      this.dispose()
      this.setMesh()
    })
  }
}
