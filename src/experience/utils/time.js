import { EventDispatcher } from 'three'

export default class Time extends EventDispatcher {
  constructor() {
    super()

    // Setup
    this.start = Date.now()
    this.current = this.start
    this.elapsed = 0
    this.delta = 16 // how many milliseconds there is between two frames at 60fps

    // don't call the tick method immediately to avoid having a delta equal to 0 on the first frame
    window.requestAnimationFrame(this.tick)
  }

  tick = () => {
    const current = Date.now()
    this.delta = current - this.current
    this.current = current
    this.elapsed = this.current - this.start

    this.dispatchEvent({ type: 'tick' })

    this.animationFrame = window.requestAnimationFrame(this.tick)
  }

  destroy() {
    window.cancelAnimationFrame(this.animationFrame)
  }
}
