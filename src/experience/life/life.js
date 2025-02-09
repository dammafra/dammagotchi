import { EventDispatcher } from 'three'
import lifeConfig from '../config/life'
import spritesConfig from '../config/sprites'
import Debug from '../utils/debug'
import Baby from './pet/baby'
import Death from './pet/death'
import Egg from './pet/egg'
import Pet from './pet/pet'
import Senior from './pet/senior'

export default class Life extends EventDispatcher {
  static debugName = '📊 life'

  get scheduledFormatted() {
    return Array.from(this.scheduled)
      .map(([key, value]) => `${key}: ${value.name}`)
      .join('\n')
  }

  constructor() {
    super()

    // TODO: load saved state
    this.age = 0
    this.stageStart = 0
    this.scheduled = new Map()

    this.stage = 'egg'
    this.model = ''

    this.setPet(true)

    this.debug = Debug.instance.gui?.addFolder({ title: Life.debugName })
    this.debug?.addBinding(this, 'stage', { readonly: true })
    this.debug?.addBinding(this, 'stageStart', { readonly: true })
    this.debug?.addBinding(this, 'model', { readonly: true })
    this.debug?.addBinding(this, 'age', { readonly: true })
    this.debug?.addBinding(this, 'scheduledFormatted', {
      label: 'schedule',
      readonly: true,
      multiline: true,
      rows: 5,
    })
  }

  setPet(skipTransitionIn) {
    this.previousPet = this.pet

    switch (this.stage) {
      case 'egg':
        this.pet = new Egg()
        break

      case 'babies':
        this.model = this.getRandomModel()
        this.pet = new Baby(this.model)
        break

      case 'seniors':
        this.model = this.getRandomModel()
        this.pet = new Senior(this.model)
        break

      case 'death':
        this.pet = new Death()
        break

      default:
        this.model = this.getRandomModel()
        this.pet = new Pet(this.stage, this.model)
        break
    }

    this.pet.addEventListener('ready', () => this.ready(skipTransitionIn))
  }

  ready = skipTransitionIn => {
    this.previousPet && this.previousPet.dispose()

    if (!skipTransitionIn && this.pet.transitionIn) {
      this.pet.transitionIn()
      this.schedule(this.start, lifeConfig.transitions[this.stage].in, `starting ${this.stage}`)
    } else {
      this.start()
    }

    this.dispatchEvent({ type: 'ready' })
  }

  start = () => {
    this.pet.idle()

    this.stageStart = this.age
    this.schedule(this.transition, lifeConfig.stages[this.stage], `transition`)
  }

  transition = () => {
    if (this.pet.transitionOut) {
      this.pet.transitionOut()
      this.schedule(this.next, lifeConfig.transitions[this.stage].out, `next`)
    } else {
      this.next()
    }
  }

  next = () => {
    const stages = Object.keys(lifeConfig.stages)
    const index = stages.findIndex(s => s == this.stage)
    this.stage = stages.at(index + 1)

    this.setPet()
  }

  updateSeconds() {
    this.age++
    this.checkScheduled()
    if (this.pet && this.pet.updateSeconds) this.pet.updateSeconds()
  }

  schedule(action, duration) {
    this.scheduled.set(this.age + duration, action)
  }

  checkScheduled() {
    for (const key of this.scheduled.keys()) {
      if (this.age >= key) {
        this.scheduled.get(key)()
        this.scheduled.delete(key)
      }
    }
  }

  getRandomModel() {
    const keys = Object.keys(spritesConfig.pets[this.stage])
    return keys[Math.floor(Math.random() * keys.length)]
  }
}
