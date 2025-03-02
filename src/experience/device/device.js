import Experience from '@experience'
import { EventDispatcher } from 'three'
import { Evaluator, SUBTRACTION } from 'three-bvh-csg'
import { radToDeg } from 'three/src/math/MathUtils.js'
import Button from './button'
import ButtonSlot from './button-slot'
import ColorPicker from './color-picker'
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
        radiusTop: 0.5,
        radiusBottom: 1,
        height: 0.5,
        position: { x: 0, y: 0, z: 0.5 },
        rotation: { x: -Math.PI * 0.5, y: Math.PI * 0.25, z: 0 },
      },
      {
        radiusTop: 0.32,
        radiusBottom: 0.8,
        height: 0.24,
        position: { x: 0.02, y: 0.04, z: 0.37 },
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
      { radius: 0.1, position: { x: -0.3, y: -0.6, z: 0.3 } },
      { radius: 0.1, position: { x: 0, y: -0.7, z: 0.3 } },
      { radius: 0.1, position: { x: 0.3, y: -0.6, z: 0.3 } },
      { radius: 0.05, position: { x: 0.3, y: -0.6, z: -0.3 } },
    ],
    buttons: [
      {
        radius: 0.09,
        scale: { x: 1, y: 1, z: 0.5 },
        rotation: { x: Math.PI * 0.1, y: -Math.PI * 0.1, z: 0 },
        position: { x: -0.3, y: -0.6, z: 0.3 },
        color: '#996600',
        onPress: () => this.dispatchEvent({ type: 'press-A-button' }),
      },
      {
        radius: 0.09,
        scale: { x: 1, y: 1, z: 0.5 },
        rotation: { x: Math.PI * 0.15, y: 0, z: 0 },
        position: { x: 0, y: -0.7, z: 0.3 },
        color: '#996600',
        onPress: () => this.dispatchEvent({ type: 'press-B-button' }),
      },
      {
        radius: 0.09,
        scale: { x: 1, y: 1, z: 0.5 },
        rotation: { x: Math.PI * 0.1, y: Math.PI * 0.1, z: 0 },
        position: { x: 0.3, y: -0.6, z: 0.3 },
        color: '#996600',
        onPress: () => this.dispatchEvent({ type: 'press-C-button' }),
      },
      {
        radius: 0.0405,
        scale: { x: 1, y: 1, z: 0.5 },
        rotation: { x: -Math.PI * 0.1, y: -Math.PI * 0.1, z: 0 },
        position: { x: 0.3, y: -0.6, z: -0.28 },
        color: 'gray',
        onPress: () => this.dispatchEvent({ type: 'press-reset-button' }),
        onRelease: () => this.dispatchEvent({ type: 'release-reset-button' }),
        detach: true,
      },
    ],
    tab: {
      width: 0.8,
      height: 0.3,
      radius: 0.25,
      position: { x: 0.85, y: -0.2, z: 0 },
      onPull: () => {
        this.tab.dispose()
        this.tab = null
        localStorage.setItem('tab-pulled', 'true')
        this.dispatchEvent({ type: 'tab' })
      },
    },
  }

  constructor() {
    super()

    this.experience = Experience.instance
    this.scene = this.experience.scene
    this.pointer = this.experience.pointer

    this.setMesh()
    this.colorPicker = new ColorPicker()

    window.addEventListener('keydown', e => {
      switch (e.key) {
        case ' ':
          this.dispatchEvent({ type: 'press-A-button' })
          break
        case 'Enter':
          this.dispatchEvent({ type: 'press-B-button' })
          break
        case 'Escape':
          this.dispatchEvent({ type: 'press-C-button' })
          break
      }
    })
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

    this.scene.add(this.mesh, ...this.buttons.map(b => b.mesh))
  }

  ready() {
    if (!JSON.parse(localStorage.getItem('tab-pulled'))) {
      this.tab = new Tab(this.config.tab)
      this.scene.add(this.tab.mesh)
    }
  }

  dispose() {
    this.shell.dispose()
    this.frames.forEach(f => f.dispose())
    this.notch.dispose()
    this.buttonSlots.forEach(bs => bs.dispose())
    this.tab?.dispose()

    this.scene.remove(this.mesh, ...this.buttons.map(b => b.mesh), this.tab.mesh)
  }

  setDebug(debug) {
    this.debug = debug.gui.addFolder({ title: Device.debugName, expanded: false })

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

    this.debug.on('change', () => {
      this.dispose()
      this.setMesh()
    })
  }

  update() {
    if (this.tab) this.tab.update()
  }
}
