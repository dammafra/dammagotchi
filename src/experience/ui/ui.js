import Experience from '../experience'
import Icons, { Icon } from './icons'
import Menu from './menu'
import { Soundboard } from './soundboard'

export default class UI {
  constructor() {
    this.experience = Experience.instance
    this.device = this.experience.device
    this.life = this.experience.life

    this.icons = new Icons()
    this.menu = new Menu()

    this.resetTimeout = null

    this.life.addEventListener('start-evolving', this.reset)
    this.device.addEventListener('button-A', this.onButtonA)
    this.device.addEventListener('button-B', this.onButtonB)
    this.device.addEventListener('button-C', this.onButtonC)
  }

  onButtonA = () => {
    if (!this.life.pet.canInteract) return

    if (this.menu.visible) {
      this.menu.selectFoodType()
      Soundboard.instance.play('button')
    } else {
      this.icons.cycle()
      if (this.icons.selected !== Icon.ATTENTION) Soundboard.instance.play('button')
    }

    this.scheduleReset()
  }

  onButtonB = () => {
    if (!this.life.pet.canInteract) return

    if (this.menu.visible) {
      this.menu.hide()
      this.icons.reset()
      this.life.pet.eat(this.menu.foodType)
    } else if (this.icons.selected === Icon.FEED) {
      this.menu.show()
    } else if (this.icons.selected < 7) {
      this.life.pet.no()
    }

    Soundboard.instance.play('button')
    this.scheduleReset()
  }

  onButtonC = () => {
    if (!this.life.pet.canInteract) return

    if (this.menu.visible) {
      this.menu.hide()
    } else {
      this.icons.reset()
    }

    Soundboard.instance.play('button')
    this.scheduleReset()
  }

  scheduleReset() {
    this.resetTimeout && clearTimeout(this.resetTimeout)
    this.resetTimeout = setTimeout(this.reset, 10000)
  }

  reset = () => {
    this.icons.reset()
    this.menu.hide()
  }
}
