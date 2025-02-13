import Experience from '../experience'
import Screen from '../screen/screen'
import Debug from '../utils/debug'
import Environment from './environment'
import Shell from './shell'

export default class Device {
  static debugName = '🥚 device'

  config = {
    shell: {
      girth: 0.8,
      apex: 0.15,
      scaleZ: 0.5,
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
    this.scene.add(this.shell.mesh)
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
    this.scene.remove(this.shell.mesh)
  }

  setDebug() {
    this.debug = Debug.instance.gui?.addFolder({ title: Device.debugName })
    if (!this.debug) return

    const shellFolder = this.debug.addFolder({ title: 'shell' })
    shellFolder.addBinding(this.config.shell, 'girth', { min: 0, max: 2, step: 0.001 })
    shellFolder.addBinding(this.config.shell, 'apex', { min: 0, max: 2, step: 0.001 })
    shellFolder.addBinding(this.config.shell, 'scaleZ', { min: 0, max: 2, step: 0.001 })

    this.debug.on('change', () => {
      this.dispose()
      this.setMesh()
    })
  }
}
