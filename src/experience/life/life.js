import { EventDispatcher } from 'three'
import lifeConfig from '../config/life'
import spritesConfig from '../config/sprites'
import Environment from './environment'
import Baby from './pet/baby'
import Egg from './pet/egg'
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

    this.dispatchEvent({ type: 'ready' })
  }

  setPet(transitioning) {
    this.setStageEnd()

    switch (this.stage) {
      case 'egg':
        this.pet = new Egg()
        break
      case 'babies':
        this.model = this.model || this.getRandomModel()
        this.pet = new Baby(this.model, transitioning)
        break
    }

    this.pet.sprites.addEventListener('ready', this.ready)
  }

  nextStage() {
    this.toDispose = this.pet

    const stages = Object.keys(lifeConfig.stages)
    const index = stages.findIndex(s => s == this.stage)
    this.stage = stages.at(index + 1)

    this.setPet(true)
  }

  updateSeconds() {
    if (!this.pet || !this.pet.updateSeconds) return

    this.age += 1
    this.pet.updateSeconds(this.age)

    if (this.age > this.stageEnd) this.nextStage()
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
