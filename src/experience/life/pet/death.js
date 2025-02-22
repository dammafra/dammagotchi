import idle from './animations/idle'
import Pet from './pet'

export default class Death extends Pet {
  constructor() {
    super('death')

    this.evolveIn = null
    this.evolveOut = null
    this.idle = idle.death
  }
}
