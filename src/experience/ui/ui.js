import Experience from '@experience'
import Countdown from './countdown'
import Icons from './icons'
import MenuFeed from './menu/menu-feed'
import MenuLight from './menu/menu-light'
import MenuMeter from './menu/menu-meter'
import { Soundboard } from './soundboard'

export default class UI {
  constructor() {
    this.experience = Experience.instance
    this.camera = this.experience.camera
    this.device = this.experience.device
    this.life = this.experience.life

    this.icons = new Icons()
    this.menus = [new MenuFeed(), new MenuLight(), null, null, null, new MenuMeter(), null]

    this.selectedMenu = this.menus.find(m => m?.debug)
    this.resetTimeout = null

    Soundboard.init()

    this.device.addEventListener('press-A-button', this.onA)
    this.device.addEventListener('press-B-button', this.onB)
    this.device.addEventListener('press-C-button', this.onC)
    this.device.addEventListener('press-reset-button', this.onResetPress)
    this.device.addEventListener('release-reset-button', this.onResetRelease)
    this.device.addEventListener('tab', this.onTab)
    this.life.addEventListener('evolve-out', this.onEvolveOut)
    this.life.addEventListener('reset', this.onReset)

    window.addEventListener('keydown', e => {
      switch (e.key) {
        case ' ':
          this.onA()
          break
        case 'ArrowUp':
        case 'ArrowDown':
          if (this.selectedMenu) this.onA()
          break
        case 'Enter':
          this.onB()
          break
        case 'Escape':
          this.onC()
          break
      }
    })
  }

  ready() {
    this.icons.ready()
    this.icons.setSelected(this.menus.indexOf(this.selectedMenu))
    this.life.addEventListener('notify', this.icons.notifyAttention)
    this.life.addEventListener('resolve', this.icons.resolveAttention)
  }

  onTab = () => {
    this.life.start()
    this.camera.intro()
    this.experience.resetTutorial()
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
