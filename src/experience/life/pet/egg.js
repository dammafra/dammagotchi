import evolveOut from './animations/evolve-out'
import idle from './animations/idle'
import Pet from './pet'

export default class Egg extends Pet {
  constructor() {
    super('egg')

    this.evolveIn = null
    this.evolveOut = evolveOut.egg
    this.idle = idle.egg

    this.eat = null
    this.mess = null
    this.flush = null
    this.toilet = null
    this.sick = null

    this.happy = null
    this.upset = null
    this.no = null
    this.death = null
  }
}
