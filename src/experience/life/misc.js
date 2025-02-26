import Sprites from '@utils/sprites'

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
    return this.sprites.get(sprite)
  }

  getHappy() {
    return this.sprites.get('happy').at(0)
  }

  getEffort() {
    return this.sprites.get('effort').at(0).clone()
  }

  getMess(stage) {
    return this.sprites
      .get('mess')
      .at(['babies', 'children'].includes(stage) ? 0 : 1)
      .clone()
  }

  getToilet(stage) {
    return this.sprites.get('toilet').at(['babies', 'children'].includes(stage) ? 0 : 1)
  }

  getToilet(stage) {
    return this.sprites.get('toilet').at(['babies', 'children'].includes(stage) ? 0 : 1)
  }

  getFlush() {
    return this.sprites.get('toilet').at(2)
  }
}
