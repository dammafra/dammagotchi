import { Soundboard } from '@ui/soundboard'
import Menu from './menu'

export default class MenuDiscipline extends Menu {
  constructor() {
    super()
  }

  action() {
    this.life.stats.bad = false
    this.life.pet.upset()
    this.life.stats.resolveNeeds()
    Soundboard.instance.play('discipline')
  }
}
