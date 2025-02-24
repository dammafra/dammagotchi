export default class Scheduler {
  get scheduledFormatted() {
    return Array.from(this.scheduled.keys())
      .sort((a, b) => a - b)
      .map(key => [key, this.scheduled.get(key)])
      .map(([key, value]) => `${key}: ${value.label}`)
      .join('\n')
  }

  constructor() {
    const state = this.loadState()

    this.tick = state.tick
    this.scheduled = new Map()
  }

  scheduleAt(tick, action, label) {
    this.scheduled.set(tick, { label, action })
  }

  scheduleIn(delay, action, label) {
    this.scheduled.set(this.tick + delay, { label, action })
  }

  updateSeconds() {
    this.tick++
    this.checkScheduled()
    this.saveState()
  }

  checkScheduled() {
    for (const key of this.scheduled.keys()) {
      if (this.tick >= key) {
        this.scheduled.get(key).action()
        this.scheduled.delete(key)
      }
    }
  }

  saveState() {
    const state = {
      tick: this.tick,
    }
    localStorage.setItem('scheduler', JSON.stringify(state))
  }

  loadState() {
    const state = localStorage.getItem('scheduler')
    if (state) {
      return JSON.parse(state)
    } else {
      return {
        tick: 0,
      }
    }
  }

  reset() {
    this.tick = 0
    this.scheduled.clear()
  }

  setDebug(debug) {
    debug.addBlade({
      view: 'separator',
    })
    debug.addBinding(this, 'tick', { readonly: true })
    debug.addBinding(this, 'scheduledFormatted', {
      label: 'schedule',
      readonly: true,
      multiline: true,
      rows: 5,
    })
  }
}
