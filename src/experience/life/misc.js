import Sprites from '../utils/sprites'

export default class Misc {
  static sprites = Sprites.for('misc')

  static get(sprite) {
    return Misc.sprites.get(sprite)
  }
}
