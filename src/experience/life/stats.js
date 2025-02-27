import lifeConfig from '@config/life'
import Experience from '@experience'
import Random from '@utils/random'
import { EventDispatcher } from 'camera-controls'

export default class Stats extends EventDispatcher {
  static debugName = '📊 stats'

  constructor(life) {
    super()

    this.experience = Experience.instance
    this.life = life

    const state = this.loadState()
    this.age = state.age
    this.weight = state.weight
    this.discipline = state.discipline
    this.hungry = state.hungry
    this.happy = state.happy
    this.mess = state.mess
    this.sick = state.sick
  }

  updateSeconds() {
    Random.runOneIn(() => this.hungry && this.hungry--, lifeConfig.stats.hungryDecayRate)
    Random.runOneIn(() => this.happy && this.happy--, lifeConfig.stats.happyDecayRate)
    Random.runOneIn(
      () => this.mess < 4 && this.life.pet.mess(),
      lifeConfig.stats.messGenerationRate,
    )
    Random.runOneIn(() => !this.sick && (this.sick = true), lifeConfig.stats.sicknessRate)

    this.saveState()
  }

  saveState() {
    const state = {
      age: this.age,
      weight: this.weight,
      discipline: this.discipline,
      hungry: this.hungry,
      happy: this.happy,
      mess: this.mess,
      sick: this.sick,
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
        sick: false,
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
    this.sick = false
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
    debug.addBinding(this, 'sick', { readonly: true, label: '💉 sick' })
  }
}
