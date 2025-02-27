import { Soundboard } from '@ui/soundboard'
import Menu from './menu'

export default class MenuDiscipline extends Menu {
  constructor() {
    super()
  }

  action() {
    this.life.pet.upset()
    Soundboard.instance.play('discipline')
    this.life.stats.bad = false
  }
}
