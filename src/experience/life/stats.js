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
    this.bad = state.bad
  }

  updateSeconds() {
    if (['egg', 'death'].includes(this.life.stage) || !this.life.pet.canEvolve) return

    Random.runOneIn(() => this.hungry && this.hungry--, lifeConfig.stats.hungryDecayRate)
    Random.runOneIn(() => this.happy && this.happy--, lifeConfig.stats.happyDecayRate)
    Random.runOneIn(this.addMess, lifeConfig.stats.messGenerationRate)
    Random.runOneIn(this.setSick, lifeConfig.stats.sicknessRate)
    Random.runOneIn(this.setBad, lifeConfig.stats.badRate)

    this.saveState()
    this.checkNeeds()
  }

  checkNeeds() {
    !this.hungry && this.life.dispatchEvent({ type: 'notify', need: 'hungry' })
    !this.happy && this.life.dispatchEvent({ type: 'notify', need: 'happy' })
    this.sick && this.life.dispatchEvent({ type: 'notify', need: 'sick' })
    this.bad && this.life.dispatchEvent({ type: 'notify', need: 'bad' })
  }

  resolveNeeds() {
    this.hungry && this.life.dispatchEvent({ type: 'resolve', need: 'hungry' })
    this.happy && this.life.dispatchEvent({ type: 'resolve', need: 'happy' })
    !this.sick && this.life.dispatchEvent({ type: 'resolve', need: 'sick' })
    !this.bad && this.life.dispatchEvent({ type: 'resolve', need: 'bad' })
  }

  addMess = () => {
    if (this.mess < 4 && !this.life.pet.isMessing) {
      this.mess++
      this.life.pet.mess()
    }
  }

  setSick = () => {
    if (!this.sick) this.sick = true
  }

  setBad = () => {
    if (!this.bad) this.bad = true
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
      bad: this.bad,
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
        bad: false,
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
    this.bad = false
    this.saveState()
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
    debug.addBinding(this, 'bad', { readonly: true, label: '😈 bad' })
  }
}
