import { EventDispatcher } from 'three'
import { Timer } from 'three/addons/misc/Timer.js'

export default class Time extends EventDispatcher {
  constructor() {
    super()

    // Setup
    this.timer = new Timer()

    this.elapsed = 0
    this.delta = 16 // how many milliseconds there is between two frames at 60fps
    this.elapsedSeconds = 0

    // don't call the tick method immediately to avoid having a delta equal to 0 on the first frame
    window.requestAnimationFrame(this.tick)
  }

  tick = () => {
    this.timer.update()

    this.delta = this.timer.getDelta() * 1000
    this.elapsed = this.timer.getElapsed() * 1000

    this.dispatchEvent({ type: 'tick' })

    const currentSeconds = Math.floor(this.elapsed / 1000)
    if (this.elapsedSeconds < currentSeconds) {
      this.dispatchEvent({ type: 'tick-seconds' })
    }
    this.elapsedSeconds = currentSeconds

    this.animationFrame = window.requestAnimationFrame(this.tick)
  }

  destroy() {
    window.cancelAnimationFrame(this.animationFrame)
  }
}
