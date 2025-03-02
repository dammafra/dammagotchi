import Experience from '@experience'
import Countdown from './countdown'
import Icons from './icons'
import MenuDiscipline from './menu/menu-discipline'
import MenuDuck from './menu/menu-duck'
import MenuFeed from './menu/menu-feed'
import MenuLight from './menu/menu-light'
import MenuMedicine from './menu/menu-medicine'
import MenuMeter from './menu/menu-meter'
import MenuPlay from './menu/menu-play'
import { Soundboard } from './soundboard'

export default class UI {
  constructor() {
    Soundboard.init()

    this.experience = Experience.instance
    this.camera = this.experience.camera
    this.device = this.experience.device
    this.life = this.experience.life

    this.icons = new Icons()
    this.resetTimeout = null

    this.enableButtons()

    this.device.addEventListener('press-reset-button', this.onResetPress)
    this.device.addEventListener('release-reset-button', this.onResetRelease)
    this.device.addEventListener('tab', this.onTab)
    this.life.addEventListener('evolve-out', this.onEvolveOut)
    this.life.addEventListener('reset', this.onReset)
  }

  enableButtons() {
    this.device.addEventListener('press-A-button', this.onA)
    this.device.addEventListener('press-B-button', this.onB)
    this.device.addEventListener('press-C-button', this.onC)
  }

  disableButtons() {
    this.device.removeEventListener('press-A-button', this.onA)
    this.device.removeEventListener('press-B-button', this.onB)
    this.device.removeEventListener('press-C-button', this.onC)
  }

  ready() {
    this.icons.ready()
    this.life.addEventListener('notify', this.icons.notifyAttention)
    this.life.addEventListener('resolve', this.icons.resolveAttention)

    this.menus = [
      new MenuFeed(),
      new MenuLight(),
      new MenuPlay(),
      new MenuMedicine(),
      new MenuDuck(),
      new MenuMeter(),
      new MenuDiscipline(),
    ]
  }

  onTab = () => {
    this.life.start()
    this.camera.intro()
    this.experience.setTutorial()
  }

  onA = () => {
    if (!this.life.pet?.canInteract) return

    if (this.selectedMenu) {
      this.selectedMenu.cycle()
    } else {
      this.icons.cycle()
    }

    if (this.icons.selected !== Icons.ATTENTION) {
      Soundboard.instance.play('button')
    }
    this.scheduleReset()
  }

  onB = () => {
    if (!this.life.pet?.canInteract) return
    if (this.icons.selected === Icons.ATTENTION) return
    if (this.life.stats.sleep && ![Icons.LIGHT, Icons.METER].includes(this.icons.selected)) return

    if (this.selectedMenu) {
      this.selectedMenu = this.selectedMenu.action()
    } else {
      this.selectedMenu = this.menus.at(this.icons.selected)
      if (this.selectedMenu) {
        if (this.selectedMenu.hasOptions) {
          this.selectedMenu.show()
        } else {
          this.selectedMenu.action()
          this.selectedMenu = null
        }
      } else {
        this.life.pet?.no()
      }
    }

    Soundboard.instance.play('button')
    this.scheduleReset()
  }

  onC = () => {
    if (!this.life.pet?.canInteract) {
      if (this.life.evolving) return

      this.life.pet?.idle()
      return
    }

    if (this.selectedMenu) {
      this.selectedMenu.hide()
      this.selectedMenu = null
    } else {
      this.icons.reset()
    }

    Soundboard.instance.play('button')
    this.scheduleReset()
  }

  onResetPress = () => {
    if (!this.life.started) return

    this.camera.controls.enabled = false
    this.countdown = new Countdown(3, this.life.reset)
  }

  onResetRelease = () => {
    this.camera.controls.enabled = true
    this.countdown?.reset()
  }

  onReset = () => {
    this.camera.intro()
    this.reset(true)
  }

  onEvolveOut = () => {
    this.reset(false)
  }

  scheduleReset() {
    this.resetTimeout && clearTimeout(this.resetTimeout)
    this.resetTimeout = setTimeout(this.reset, 10000)
  }

  reset = resetAttention => {
    this.icons.reset(resetAttention)
    this.selectedMenu?.hide()
    this.selectedMenu = null
  }
}
