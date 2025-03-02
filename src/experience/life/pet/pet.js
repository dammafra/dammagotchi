import Experience from '@experience'
import Sprites from '@utils/sprites'
import { EventDispatcher } from 'three'
import death from './animations/death'
import eat from './animations/eat'
import evolveIn from './animations/evolve-in'
import evolveOut from './animations/evolve-out'
import flush from './animations/flush'
import happy from './animations/happy'
import idle from './animations/idle'
import mess from './animations/mess'
import no from './animations/no'
import sick from './animations/sick'
import sleep from './animations/sleep'
import toilet from './animations/toilet'
import upset from './animations/upset'

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
    this.time = this.experience.time
    this.screen = this.experience.screen

    this.stage = stage
    this.model = model
    this.canEvolve = false
    this.canInteract = false
    this.isMessing = false
    this.isSleeping = false

    const sprite = this.model ? `pets.${this.stage}.${this.model}` : `pets.${this.stage}`
    this.sprites = Sprites.for(sprite)

    this.sprites.addEventListener('ready', () => this.dispatchEvent({ type: 'ready' }))

    this.evolveIn = evolveIn.default
    this.evolveOut = evolveOut.default
    this.idle = idle.default

    this.eat = eat.default
    this.mess = mess.default
    this.flush = flush.default
    this.toilet = toilet.default
    this.sick = sick.default
    this.sleep = sleep.default

    this.happy = happy.default
    this.upset = upset.default
    this.no = no.default
    this.death = death.default
  }
}
