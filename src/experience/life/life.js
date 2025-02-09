import { EventDispatcher } from 'three'
import lifeConfig from '../config/life'
import spritesConfig from '../config/sprites'
import Environment from './environment'
import Baby from './pet/baby'
import Death from './pet/death'
import Egg from './pet/egg'
import Pet from './pet/pet'
import Senior from './pet/senior'
import Room from './room'

export default class Life extends EventDispatcher {
  constructor() {
    super()

    this.environment = new Environment()
    this.room = new Room()

    // TODO: load saved state
    this.age = 0
    this.stageStart = 0
    this.scheduled = new Map()

    this.stage = 'egg'
    this.model = undefined

    this.setPet(true)
  }

  setPet(skipTransitionIn) {
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
    this.toDispose && this.toDispose.dispose()

    if (!skipTransitionIn && this.pet.transitionIn) {
      this.pet.transitionIn()
      this.schedule(this.start, lifeConfig.transitions[this.stage].in)
    } else {
      this.start()
    }

    this.dispatchEvent({ type: 'ready' })
  }

  start = () => {
    this.pet.idle()

    this.stageStart = this.age
    this.schedule(this.transition, lifeConfig.stages[this.stage])
  }

  transition = () => {
    if (this.pet.transitionOut) {
      this.pet.transitionOut()
      this.schedule(this.next, lifeConfig.transitions[this.stage].out)
    } else {
      this.next()
    }
  }

  next = () => {
    this.toDispose = this.pet

    const stages = Object.keys(lifeConfig.stages)
    const index = stages.findIndex(s => s == this.stage)
    this.stage = stages.at(index + 1)

    this.setPet()
  }

  updateSeconds() {
    this.environment.updateSeconds()

    this.age++
    this.checkScheduled()
    if (this.pet && this.pet.updateSeconds) this.pet.updateSeconds()
  }

  schedule(callback, duration) {
    this.scheduled.set(this.age + duration, callback)
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
