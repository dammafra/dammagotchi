import Sprites from '../utils/sprites'

export default class Food {
  /** @type {Food} */
  static instance

  static MEAL = 'meal'
  static SNACK = 'snack'

  static init() {
    return new Food()
  }

  constructor() {
    // Singleton
    if (Food.instance) {
      return Food.instance
    }
    Food.instance = this

    this.sprites = Sprites.for('food')
  }

  get(type, stage) {
    const main = this.sprites.get(`${type}.${stage}`).at(0)
    let partials = this.sprites.get(`${type}.${stage}.partial`)

    if (type === 'snack' && stage === 'seniors') {
      partials = partials.concat(partials)
    }

    return [main, ...partials]
  }
}
