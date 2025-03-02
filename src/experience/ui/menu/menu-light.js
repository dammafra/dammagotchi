import Menu from './menu'

export default class MenuLight extends Menu {
  constructor() {
    super()
  }

  action() {
    this.life.stats.sleep ? this.life.pet.idle() : this.life.pet.sleep()
  }
}
