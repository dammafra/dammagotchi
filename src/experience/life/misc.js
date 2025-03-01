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

  getHappy() {
    return this.sprites.get('happy').at(0)
  }

  getUpset() {
    const [upset1, _, upset2] = this.sprites.get('upset')
    return [upset1, upset2]
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

  getSickness(stage) {
    return this.sprites.get('sickness').at(['babies', 'children'].includes(stage) ? 0 : 1)
  }

  getGame() {
    const [ready, go] = this.sprites.get('game')
    const obstacle = this.sprites.get('obstacle').at(0)
    return [ready, go, obstacle]
  }
}
