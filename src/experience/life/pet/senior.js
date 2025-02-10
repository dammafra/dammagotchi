import Pet from './pet'

export default class Senior extends Pet {
  constructor(model) {
    super('seniors', model)
  }

  transitionOut = () => {
    this.dispose && this.dispose()

    const eyesClosed = this.sprites.get('eyes-closed').at(0)
    eyesClosed.spawn()

    const startedAt = this.time.elapsedSeconds

    this.updateSeconds = () => {
      if (this.time.elapsedSeconds > startedAt + 3) {
        eyesClosed.mesh.position.y += this.grid.unit * 4
      }
    }

    this.dispose = () => {
      eyesClosed.dispose()
    }
  }
}
