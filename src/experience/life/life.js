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

    this.stage = 'egg'
    this.model = undefined

    this.setPet()
  }

  ready = () => {
    this.toDispose && this.toDispose.dispose()
    this.pet.ready()
    this.transitioning = false

    this.dispatchEvent({ type: 'ready' })
  }

  setPet() {
    this.setStageEnd()

    switch (this.stage) {
      case 'egg':
        this.pet = new Egg()
        break

      case 'babies':
        this.model = this.getRandomModel()
        this.pet = new Baby(this.model, this.transitioning)
        break

      case 'seniors':
        this.model = this.getRandomModel()
        this.pet = new Senior(this.model, this.transitioning)
        break

      case 'death':
        this.pet = new Death()
        break

      default:
        this.model = this.getRandomModel()
        this.pet = new Pet(this.stage, this.model, this.transitioning)
        break
    }

    this.pet.addEventListener('ready', this.ready)
  }

  nextStage = () => {
    this.toDispose = this.pet

    const stages = Object.keys(lifeConfig.stages)
    const index = stages.findIndex(s => s == this.stage)
    this.stage = stages.at(index + 1)

    this.setPet()
  }

  updateSeconds() {
    this.environment.updateSeconds()

    if (!this.pet || !this.pet.updateSeconds) return

    // TODO: avoid age progress durint transition in
    this.age += 1
    this.pet.updateSeconds(this.age)

    if (this.transitioning) return
    if (this.age === this.stageEnd) this.transition()
  }

  transition() {
    this.transitioning = true

    this.pet.transitionOut()
    this.pet.addEventListener('transition-end', this.nextStage)
  }

  setStageEnd() {
    this.stageStart = this.age
    this.stageEnd = this.stageStart + lifeConfig.stages[this.stage]
  }

  getRandomModel() {
    const keys = Object.keys(spritesConfig.pets[this.stage])
    return keys[Math.floor(Math.random() * keys.length)]
  }
}
