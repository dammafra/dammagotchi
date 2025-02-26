import Experience from '@experience'
import Sprites from '@utils/sprites'
import { EventDispatcher } from 'three'
import death from './animations/death'
import eat from './animations/eat'
import evolveIn from './animations/evolve-in'
import evolveOut from './animations/evolve-out'
import idle from './animations/idle'
import mess from './animations/mess'
import no from './animations/no'

export default class Pet extends EventDispatcher {
  get life() {
    return this.experience.life
  }

  get stats() {
    return this.experience.life.stats
  }

  get tick() {
    return this.experience.life.tick
  }

  constructor(stage, model) {
    super()

    this.experience = Experience.instance
    this.screen = this.experience.screen

    this.stage = stage
    this.model = model
    this.canInteract = false

    const sprite = this.model ? `pets.${this.stage}.${this.model}` : `pets.${this.stage}`
    this.sprites = Sprites.for(sprite)

    this.sprites.addEventListener('ready', () => this.dispatchEvent({ type: 'ready' }))

    this.evolveIn = evolveIn.default
    this.evolveOut = evolveOut.default
    this.idle = idle.default

    this.eat = eat.default
    this.mess = mess.default

    this.no = no.default
    this.death = death.default
  }
}
