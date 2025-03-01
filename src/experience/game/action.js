import Experience from '@experience'
import fell from './animations/fell'
import intro from './animations/intro'
import jump from './animations/jump'
import run from './animations/run'
import shift from './animations/shift'

export default class Action {
  get tick() {
    return this.experience.game.tick
  }

  constructor() {
    this.experience = Experience.instance
    this.time = this.experience.time
    this.life = this.experience.life
    this.game = this.experience.game
    this.time = this.experience.time
    this.screen = this.experience.screen

    this.intro = intro
    this.run = run
    this.fell = fell
    this.jump = jump
    this.shift = shift
  }
}
