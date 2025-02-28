import Menu from './menu'

export default class MenuPlay extends Menu {
  constructor() {
    super()
  }

  action() {
    if (!this.life.stats.bad && !this.life.stats.sick) {
      this.life.pet.play()

      if (this.life.stats.happy < 3) {
        this.life.stats.happy += 2
      } else if (this.life.stats.happy < 4) {
        this.life.stats.happy++
      }

      if (this.life.stats.weight) {
        this.life.stats.weight--
      }

      this.life.stats.resolveNeeds()
    } else {
      this.life.pet.no()
    }
  }
}
