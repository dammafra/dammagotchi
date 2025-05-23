import idle from './animations/idle'
import Pet from './pet'

export default class Death extends Pet {
  constructor() {
    super('death')

    this.evolveIn = null
    this.evolveOut = null
    this.idle = idle.death

    this.eat = null
    this.mess = null
    this.flush = null
    this.toilet = null
    this.sick = null
    this.sleep = null

    this.happy = null
    this.upset = null
    this.no = null
    this.death = null
  }
}
