import Menu from './menu'

export default class MenuLight extends Menu {
  constructor() {
    super()
    this.cycle = null
  }

  action() {
    this.screen.isBlank ? this.screen.turnOn() : this.screen.turnOff()
  }
}
