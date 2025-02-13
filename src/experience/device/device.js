import Experience from '../experience'
import Screen from '../screen/screen'
import Debug from '../utils/debug'
import Environment from './environment'

export default class Device {
  static debugName = '🥚 device'

  constructor() {
    this.experience = Experience.instance
    this.debug = Debug.instance.gui?.addFolder({ title: Device.debugName })
    this.scene = this.experience.scene

    this.screen = new Screen()
  }

  ready() {
    this.environment = new Environment()
    this.screen.ready()
  }

  update() {
    this.screen.update()
  }
}
