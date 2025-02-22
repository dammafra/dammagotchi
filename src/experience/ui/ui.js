import Experience from '../experience'
import Icons from './icons'
import MenuFeed from './menu/menu-feed'
import MenuLight from './menu/menu-light'
import { Soundboard } from './soundboard'

export default class UI {
  constructor() {
    this.experience = Experience.instance
    this.camera = this.experience.camera
    this.device = this.experience.device
    this.life = this.experience.life

    this.icons = new Icons()
    this.menuFeed = new MenuFeed()
    this.menuLight = new MenuLight()

    this.selectedMenu = null
    this.resetTimeout = null

    Soundboard.init()

    this.device.addEventListener('button-A', this.onButtonA)
    this.device.addEventListener('button-B', this.onButtonB)
    this.device.addEventListener('button-C', this.onButtonC)
    this.device.addEventListener('tab', this.onTab)

    window.addEventListener('keydown', e => {
      switch (e.key) {
        case ' ':
          this.onButtonA()
          break
        case 'ArrowUp':
        case 'ArrowDown':
          if (this.selectedMenu) this.onButtonA()
          break
        case 'Enter':
          this.onButtonB()
          break
        case 'Escape':
          this.onButtonC()
          break
      }
    })
  }

  ready() {
    this.icons.ready()
  }

  onTab = () => {
    this.camera.intro()
    this.life.start()
    this.experience.resetTutorial()
  }

  onButtonA = () => {
    if (!this.life.pet?.canInteract) return

    if (this.selectedMenu) {
      this.selectedMenu.cycle()
    } else {
      this.icons.cycle()
    }

    this.scheduleReset()
  }

  onButtonB = () => {
    if (!this.life.pet?.canInteract) return

    if (this.selectedMenu) {
      this.selectedMenu.action()
      this.selectedMenu.hide()
      this.selectedMenu = null
    } else {
      switch (this.icons.selected) {
        case Icons.FEED:
          this.selectedMenu = this.menuFeed
          break
        case Icons.LIGHT:
          this.selectedMenu = this.menuLight
          break
        case Icons.ATTENTION:
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

  // TODO:* improve reset on evolution
  reset = () => {
    this.icons.reset()
    this.selectedMenu?.hide()
    this.selectedMenu = null
  }
}
