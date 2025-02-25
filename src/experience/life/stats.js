import Experience from '@experience'
import { EventDispatcher } from 'camera-controls'

export default class Stats extends EventDispatcher {
  static debugName = '📊 stats'

  constructor(life, scheduler) {
    super()

    this.experience = Experience.instance
    this.life = life
    this.scheduler = scheduler

    const state = this.loadState()
    this.age = state.age
    this.weight = state.weight
    this.discipline = state.discipline
    this.hungry = state.hungry
    this.happy = state.happy
    this.mess = state.mess
  }

  updateSeconds() {
    this.hungryDecay()
    this.happyDecay()

    this.saveState()
  }

  hungryDecay() {
    // probability of 1/200 ticks
    Math.random() < 0.005 && this.hungry && this.hungry--
  }

  happyDecay() {
    // probability of 1/200 ticks
    Math.random() < 0.005 && this.happy && this.happy--
  }

  saveState() {
    const state = {
      age: this.age,
      weight: this.weight,
      discipline: this.discipline,
      hungry: this.hungry,
      happy: this.happy,
      mess: this.mess,
    }
    localStorage.setItem('stats', JSON.stringify(state))
  }

  loadState() {
    const state = localStorage.getItem('stats')
    if (state) {
      return JSON.parse(state)
    } else {
      return {
        age: 0,
        weight: 0,
        discipline: 0,
        hungry: 0,
        happy: 0,
        mess: 0,
      }
    }
  }

  reset() {
    this.age = 0
    this.weight = 0
    this.discipline = 0
    this.hungry = 0
    this.happy = 0
    this.mess = 0
  }

  setDebug(debug) {
    debug.addBlade({
      view: 'separator',
    })
    debug.addBinding(this, 'age', { readonly: true, label: '⏳ age' })
    debug.addBinding(this, 'weight', { readonly: true, label: '⚖️ weight' })
    debug.addBinding(this, 'discipline', { readonly: true, label: '😇 discipline' })
    debug.addBinding(this, 'hungry', { readonly: true, label: '🍔 hungry' })
    debug.addBinding(this, 'happy', { readonly: true, label: '🍬 happy' })
    debug.addBinding(this, 'mess', { readonly: true, label: '💩 mess' })
  }
}
