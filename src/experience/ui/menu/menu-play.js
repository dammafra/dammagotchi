import Menu from './menu'

export default class MenuPlay extends Menu {
  constructor() {
    super()
  }

  action() {
    !this.life.stats.bad && !this.life.stats.sick ? this.experience.startGame() : this.life.pet.no()
  }
}
