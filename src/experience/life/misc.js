import Sprites from '../utils/sprites'

export default class Misc {
  /** @type {Misc} */
  static instance

  static init() {
    return new Misc()
  }

  constructor() {
    // Singleton
    if (Misc.instance) {
      return Misc.instance
    }
    Misc.instance = this

    this.sprites = Sprites.for('misc')
  }

  get(sprite) {
    return Misc.sprites.get(sprite)
  }
}
