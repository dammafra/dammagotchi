import evolveIn from './animations/evolve-in'
import Pet from './pet'

export default class Baby extends Pet {
  constructor(model) {
    super('babies', model)

    this.evolveIn = evolveIn.baby
  }
}
