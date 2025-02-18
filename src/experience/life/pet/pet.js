import { EventDispatcher } from 'three'
import Experience from '../../experience'
import Random from '../../utils/random'
import Sprites from '../../utils/sprites'
import Food from '../food'

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
  }

  evolveIn() {
    this.dispose && this.dispose()

    const idle1 = this.sprites.get('idle').at(0)
    idle1.spawn()

    this.updateSeconds = null

    this.dispose = () => {
      idle1.dispose()
    }
  }

  idle = () => {
    this.dispose && this.dispose()

    this.canInteract = true

    const idle1 = this.sprites.get('idle').at(0)
    idle1.spawn()

    const idle2 = this.sprites.get('idle').at(1)
    idle2.spawn()
    idle2.mesh.visible = false

    this.updateSeconds = () => {
      idle1.mesh.visible = Random.boolean()

      const directionX = Random.oneOf(+this.screen.unit, -this.screen.unit)

      const position = idle1.mesh.position.clone()
      position.x += directionX

      if (this.screen.contains(idle1, position)) {
        idle1.mesh.position.copy(position)
        idle1.mesh.rotation.y = directionX > 0 ? Math.PI : 0
      }

      idle2.copy(idle1)
      idle2.mesh.visible = !idle1.mesh.visible
    }

    this.dispose = () => {
      this.canInteract = false

      idle1.dispose()
      idle2.dispose()
    }
  }

  eat = type => {
    this.dispose && this.dispose()

    const [idle1] = this.sprites.get('idle')
    idle1.spawn()
    idle1.mesh.position.x = 1

    const [eat1, eat2] = this.sprites.get('eat')
    eat1.spawn()
    eat2.spawn()
    eat1.mesh.visible = false
    eat2.mesh.visible = false
    eat1.mesh.position.x = idle1.mesh.position.x
    eat2.mesh.position.x = idle1.mesh.position.x

    const [food1, food2, food3] = Food.instance.get(type, this.stage)
    food1.spawn()
    food2.spawn()
    food3.spawn()

    food1.mesh.position.y = 1.5
    food1.mesh.position.x = -1
    food2.mesh.position.x =
      food1.mesh.position.x - (this.screen.unit * (food1.width - food2.width)) / 2
    food3.mesh.position.x =
      food1.mesh.position.x - (this.screen.unit * (food1.width - food3.width)) / 2

    food2.mesh.visible = false
    food3.mesh.visible = false

    const startedAt = this.age

    this.updateSeconds = () => {
      if (this.age === startedAt + 1) {
        food1.mesh.position.y = this.screen.center.y
        idle1.mesh.visible = false
        eat2.mesh.visible = true
      }

      if (this.age === startedAt + 2) {
        food1.mesh.visible = false
        food2.mesh.visible = true

        eat2.mesh.visible = false
        eat1.mesh.visible = true
      }

      if (this.age === startedAt + 3) {
        eat1.mesh.visible = false
        eat2.mesh.visible = true
      }

      if (this.age === startedAt + 4) {
        food2.mesh.visible = false
        food3.mesh.visible = true

        eat2.mesh.visible = false
        eat1.mesh.visible = true
      }

      if (this.age === startedAt + 5) {
        eat1.mesh.visible = false
        eat2.mesh.visible = true
      }

      if (this.age === startedAt + 6) {
        food3.mesh.visible = false

        eat2.mesh.visible = false
        eat1.mesh.visible = true
      }

      if (this.age === startedAt + 7) {
        this.idle()
      }
    }

    this.dispose = () => {
      idle1.dispose()

      eat1.dispose()
      eat2.dispose()

      food1.dispose()
      food2.dispose()
      food3.dispose()
    }
  }

  no() {
    this.dispose && this.dispose()

    const no = this.sprites.get('no').at(0)
    no.spawn()

    const startedAt = this.age

    this.updateSeconds = () => {
      if (this.age === startedAt + 1) {
        no.mesh.rotation.y += Math.PI
      }

      if (this.age === startedAt + 2) {
        no.mesh.rotation.y += Math.PI
      }

      if (this.age === startedAt + 3) {
        no.mesh.rotation.y += Math.PI
      }

      if (this.age === startedAt + 4) {
        no.mesh.rotation.y += Math.PI
      }

      if (this.age === startedAt + 5) {
        this.idle()
      }
    }

    this.dispose = () => {
      no.dispose()
    }
  }

  evolveOut() {
    this.dispose && this.dispose()

    const idle1 = this.sprites.get('idle').at(0)
    idle1.spawn()

    this.updateSeconds = null

    this.dispose = () => {
      idle1.dispose()
    }
  }
}
