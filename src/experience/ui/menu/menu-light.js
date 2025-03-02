import Menu from './menu'

export default class MenuLight extends Menu {
  constructor() {
    super()
  }

  action() {
    this.life.pet.isSleeping ? this.life.pet.idle() : this.life.pet.sleep()
  }
}
