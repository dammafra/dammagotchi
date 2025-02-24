import Menu from './menu'

export default class MenuLight extends Menu {
  constructor() {
    super()
  }

  action() {
    this.screen.isBlank ? this.screen.turnOn() : this.screen.turnOff()
  }
}
