import { Soundboard } from '@ui/soundboard'
import Menu from './menu'

export default class MenuMedicine extends Menu {
  constructor() {
    super()
  }

  action() {
    if (this.life.stats.sick && !this.life.stats.bad) {
      this.life.stats.sick = false
      this.life.pet.upset()
      this.life.sickness.hide()
      this.life.stats.resolveNeeds()
      Soundboard.instance.play('angry')
    } else {
      this.life.pet.no()
    }
  }
}
