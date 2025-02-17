import { Soundboard } from '../../ui/soundboard'
import Pet from './pet'

export default class Senior extends Pet {
  constructor(model) {
    super('seniors', model)
  }

  evolveOut = () => {
    this.dispose && this.dispose()

    const eyesClosed = this.sprites.get('eyes-closed').at(0)
    eyesClosed.spawn()

    const startedAt = this.age

    Soundboard.instance.play('death')

    this.updateSeconds = () => {
      if (this.age > startedAt + 3) {
        eyesClosed.mesh.position.y += this.screen.unit * 4
      }
    }

    this.dispose = () => {
      eyesClosed.dispose()
    }
  }
}
