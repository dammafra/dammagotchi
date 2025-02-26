import death from './animations/death'
import Pet from './pet'

export default class Senior extends Pet {
  constructor(model) {
    super('seniors', model)

    this.evolveOut = death.default
  }
}
