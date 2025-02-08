import { EventDispatcher } from 'three'
import { Timer } from 'three/addons/misc/Timer.js'
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
    this.speed = 1000

    // don't call the tick method immediately to avoid having a delta equal to 0 on the first frame
    window.requestAnimationFrame(this.tick)

    this.debug = Debug.instance.gui.addFolder({ title: Time.debugName })
    this.debug.addBinding(this, 'speed', {
      options: {
        '1x': 1000,
        '2x': 500,
        '3x': 100,
        MAX: 1,
      },
    })
  }

  tick = () => {
    this.timer.update()

    this.delta = this.timer.getDelta() * 1000
    this.elapsed = this.timer.getElapsed() * 1000

    this.dispatchEvent({ type: 'tick' })

    const currentSeconds = Math.floor(this.elapsed / this.speed)
    if (this.elapsedSeconds < currentSeconds) {
      this.dispatchEvent({ type: 'tick-seconds' })
    }
    this.elapsedSeconds = currentSeconds

    this.animationFrame = window.requestAnimationFrame(this.tick)
  }

  destroy() {
    window.cancelAnimationFrame(this.animationFrame)
    Time.instance = null
  }
}
