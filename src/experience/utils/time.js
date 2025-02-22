import Experience from '@experience'
import { Soundboard } from '@ui/soundboard'
import { EventDispatcher } from 'three'
import { Timer } from 'three/addons/misc/Timer.js'

const TIME_SPEED_SETTINGS = Object.freeze({
  1: 2,
  2: 5,
  3: 10,
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

    this.setSpeedSettingsButton()
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
    if (!Object.keys(TIME_SPEED_SETTINGS).map(Number).includes(value)) return
    if (!this.experience.life.started) return

    this.speedSetting = value
    Soundboard.instance.play('time-speed', this.speedSetting)

    this.updateButton()
  }

  setSpeedSettingsButton() {
    window.addEventListener('keypress', e => this.setSpeedSetting(+e.key))
    this.button = document.getElementById('speed-settings')
    this.button.addEventListener('click', () =>
      this.setSpeedSetting(this.speedSetting === 1 ? 2 : this.speedSetting === 2 ? 3 : 1),
    )
  }

  updateButton() {
    const container = this.button.firstElementChild

    container.innerHTML = Array(this.speedSetting)
      .fill(true)
      .map((_, index) => {
        const icon = container.firstElementChild.cloneNode()
        if (index > 0) icon.style.marginLeft = '-6px'
        return icon
      })
      .map(i => i.outerHTML)
      .join('')
  }

  setDebug(debug) {
    this.debug = debug
  }
}
