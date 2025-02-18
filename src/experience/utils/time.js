import { EventDispatcher } from 'three'
import { Timer } from 'three/addons/misc/Timer.js'
import { Pane } from 'tweakpane'
import Experience from '../experience'

const TIME_SPEED_SETTINGS = Object.freeze({
  1: 2,
  2: 5,
  3: 10,
  0: 1000,
})

export default class Time extends EventDispatcher {
  get speed() {
    return TIME_SPEED_SETTINGS[this.speedSetting]
  }

  constructor() {
    super()

    this.experience = Experience.instance
    this.timer = new Timer()

    this.elapsed = 0
    this.delta = 16 // how many milliseconds there is between two frames at 60fps
    this.elapsedSeconds = 0
    this.speedSetting = 1

    // don't call the tick method immediately to avoid having a delta equal to 0 on the first frame
    window.requestAnimationFrame(this.tick)
    window.addEventListener('keypress', e => this.setSpeedSetting(e.key))

    this.setSpeedSettingsPane()
  }

  tick = () => {
    this.debug?.stats.begin()

    this.timer.update()

    this.delta = this.timer.getDelta()
    this.elapsed = this.timer.getElapsed()

    this.dispatchEvent({ type: 'tick' })

    const currentSeconds = Math.floor(this.elapsed * this.speed)
    if (this.elapsedSeconds < currentSeconds) {
      this.dispatchEvent({ type: 'tick-seconds' })
    }
    this.elapsedSeconds = currentSeconds

    this.debug?.stats.end()
    this.animationFrame = window.requestAnimationFrame(this.tick)
  }

  setSpeedSetting(value) {
    if (!Object.keys(TIME_SPEED_SETTINGS).includes(value)) return
    this.speedSetting = value
  }

  setSpeedSettingsPane() {
    const speedSettingsPane = new Pane({ title: '⏱️ TIME', expanded: false })
    speedSettingsPane.element.parentElement.style.bottom = '64px'
    speedSettingsPane.element.parentElement.style.top = 'unset'
    speedSettingsPane.element.parentElement.style.zIndex = 2

    speedSettingsPane.addBinding(this, 'speedSetting', {
      label: 'speed',
      readonly: true,
      format: speedSetting => (speedSetting === 0 ? 'MAX' : `${speedSetting}x`),
    })
    speedSettingsPane.addButton({ title: '1x [key 1]' }).on('click', () => this.setSpeedSetting('1')) //prettier-ignore
    speedSettingsPane.addButton({ title: '2x [key 2]' }).on('click', () => this.setSpeedSetting('2')) //prettier-ignore
    speedSettingsPane.addButton({ title: '3x [key 3]' }).on('click', () => this.setSpeedSetting('3')) //prettier-ignore
    speedSettingsPane.addButton({ title: 'MAX [key 0]' }).on('click', () => this.setSpeedSetting('0')) //prettier-ignore
  }

  setDebug(debug) {
    this.debug = debug
  }
}
