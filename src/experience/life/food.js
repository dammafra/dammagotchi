import Sprites from '../utils/sprites'

export default class Food {
  static sprites = Sprites.for('food')

  static MEAL = 'meal'
  static SNACK = 'snack'

  static get(type, stage) {
    const main = this.sprites.get(`${type}.${stage}`).at(0)
    let partials = this.sprites.get(`${type}.${stage}.partial`)

    if (type === 'snack' && stage === 'seniors') {
      partials = partials.concat(partials)
    }

    return [main, ...partials]
  }
}
