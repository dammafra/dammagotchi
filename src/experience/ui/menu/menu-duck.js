import Menu from './menu'

export default class MenuDuck extends Menu {
  constructor() {
    super()
  }

  action() {
    this.life.pet.isMessing ? this.life.pet.toilet() : this.life.pet.flush()
  }
}
