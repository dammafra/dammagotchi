import Menu from './menu'

export default class MenuLight extends Menu {
  constructor() {
    super()
    this.cycle = null
  }

  reset() {}

  action() {
    this.scene.backgroundIntensity = 0
  }
}
