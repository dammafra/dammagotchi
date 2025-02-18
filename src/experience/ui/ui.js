import Experience from '../experience'
import Icons from './icons'
import MenuFeed from './menu-feed'
import { Soundboard } from './soundboard'

export default class UI {
  constructor() {
    this.experience = Experience.instance
    this.device = this.experience.device
    this.life = this.experience.life

    this.icons = new Icons()
    this.menuFeed = new MenuFeed()

    this.selectedMenu = null
    this.resetTimeout = null

    this.device.addEventListener('button-A', this.onButtonA)
    this.device.addEventListener('button-B', this.onButtonB)
    this.device.addEventListener('button-C', this.onButtonC)
  }

  ready() {
    this.icons.ready()
  }

  onButtonA = () => {
    if (!this.life.pet?.canInteract) return

    if (this.selectedMenu) {
      this.selectedMenu.cycle()
    } else {
      this.icons.cycle()
    }

    if (this.icons.selected !== Icons.ATTENTION) Soundboard.instance.play('button')
    this.scheduleReset()
  }

  onButtonB = () => {
    if (!this.life.pet?.canInteract) return

    if (this.selectedMenu) {
      this.icons.reset()
      this.selectedMenu.action()
      this.selectedMenu = null
    } else {
      switch (this.icons.selected) {
        case Icons.FEED:
          this.selectedMenu = this.menuFeed
          break
        default:
          this.life.pet?.no()
          break
      }

      if (this.selectedMenu) {
        if (this.selectedMenu.cycle) {
          this.selectedMenu.show()
        } else {
          this.selectedMenu.action()
          this.selectedMenu = null
        }
      }
    }

    Soundboard.instance.play('button')
    this.scheduleReset()
  }

  onButtonC = () => {
    if (!this.life.pet?.canInteract) return

    if (this.selectedMenu) {
      this.selectedMenu.hide()
      this.selectedMenu = null
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

  // TODO: reset on evolution
  reset = () => {
    this.icons.reset()
    this.selectedMenu?.hide()
    this.selectedMenu = null
  }
}
