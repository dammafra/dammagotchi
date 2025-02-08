import lifeConfig from '../config/life'
import spritesConfig from '../config/sprites'
import Environment from './environment'
import Baby from './pet/baby'
import Egg from './pet/egg'
import Room from './room'

export default class Life {
  ready() {
    this.environment = new Environment()
    this.room = new Room()

    this.age = 0
    this.stageStart = 0

    this.stage = 'egg'
    this.model = undefined

    this.init()
  }

  init() {
    this.setStageEnd()

    switch (this.stage) {
      case 'egg':
        this.pet = new Egg()
        break
      case 'babies':
        this.pet = new Baby(this.model)
        break
    }
  }

  nextStage() {
    this.pet.dispose()

    switch (this.stage) {
      case 'egg':
        this.stage = 'babies'
        this.model = this.getRandomModel()
        this.pet = new Baby(this.model, true)
        break
    }

    this.setStageEnd()
  }

  updateSeconds() {
    this.age += 1

    if (this.pet) this.pet.updateSeconds(this.age)
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
