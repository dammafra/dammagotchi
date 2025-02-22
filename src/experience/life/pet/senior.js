import evolveOut from './animations/evolve-out'
import Pet from './pet'

export default class Senior extends Pet {
  constructor(model) {
    super('seniors', model)

    this.evolveOut = evolveOut.senior
  }
}
