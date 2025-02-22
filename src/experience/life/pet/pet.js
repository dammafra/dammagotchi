import Experience from '@experience'
import Sprites from '@utils/sprites'
import { EventDispatcher } from 'three'
import eat from './animations/eat'
import evolveIn from './animations/evolve-in'
import evolveOut from './animations/evolve-out'
import idle from './animations/idle'
import no from './animations/no'

export default class Pet extends EventDispatcher {
  get age() {
    return this.experience.life.age
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
    this.no = no.default
    this.eat = eat.default
  }
}
