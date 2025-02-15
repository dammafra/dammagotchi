import { EventDispatcher } from 'three'
import { Timer } from 'three/addons/misc/Timer.js'
import { Pane } from 'tweakpane'
import Debug from './debug'

export default class Time extends EventDispatcher {
  /** @type {Time} */
  static instance
  static debugName = '⏱️ time'

  static init() {
    return new Time()
  }

  constructor() {
    super()

    // Singleton
    if (Time.instance) {
      return Time.instance
    }

    Time.instance = this

    // Setup
    this.timer = new Timer()

    this.elapsed = 0
    this.delta = 16 // how many milliseconds there is between two frames at 60fps
    this.elapsedSeconds = 0
    this.speed = 1

    this.setSpeedPane()

    // don't call the tick method immediately to avoid having a delta equal to 0 on the first frame
    window.requestAnimationFrame(this.tick)

    window.addEventListener('keypress', e => this.setSpeed(+e.key))
  }

  tick = () => {
    Debug.instance.stats?.begin()

    this.timer.update()

    this.delta = this.timer.getDelta()
    this.elapsed = this.timer.getElapsed()

    this.dispatchEvent({ type: 'tick' })

    const currentSeconds = Math.floor(this.elapsed * this.speed)
    if (this.elapsedSeconds < currentSeconds) {
      this.dispatchEvent({ type: 'tick-seconds' })
    }
    this.elapsedSeconds = currentSeconds

    Debug.instance.stats?.end()
    this.animationFrame = window.requestAnimationFrame(this.tick)
  }

  setSpeed(value) {
    if (isNaN(value) || value > 3 || value < 0) return
    if (value === 0) value = 1000
    this.speed = value
  }

  setSpeedPane() {
    const speedPane = new Pane({ title: '⏱️ TIME SPEED', expanded: false })
    speedPane.element.parentElement.style.left = '8px'
    speedPane.element.parentElement.style.bottom = '64px'
    speedPane.element.parentElement.style.top = 'unset'
    speedPane.element.parentElement.style.zIndex = 2

    speedPane.addBinding(this, 'speed', {
      readonly: true,
      format: speed => (speed === 1000 ? 'MAX' : `${speed}x`),
    })
    speedPane.addButton({ title: '1x [key 1]' }).on('click', () => this.setSpeed(1))
    speedPane.addButton({ title: '2x [key 2]' }).on('click', () => this.setSpeed(2))
    speedPane.addButton({ title: '3x [key 3]' }).on('click', () => this.setSpeed(3))
    speedPane.addButton({ title: 'MAX [key 0]' }).on('click', () => this.setSpeed(0))
  }
}
