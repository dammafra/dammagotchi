import { dispose } from '../../utils/dispose'
import Pet from './pet'

export default class Senior extends Pet {
  constructor(model, transitioning) {
    super('seniors', model, transitioning)
  }

  transitionOut = () => {
    this.dispose && this.dispose()

    const eyesClosed = this.sprites.get('eyes-closed').at(0)
    eyesClosed.mesh.visible = true
    eyesClosed.mesh.position.copy(this.grid.center)
    this.scene.add(eyesClosed.mesh)

    const startedAt = this.time.elapsedSeconds
    const finishAt = startedAt + this.config.transitions.seniors.out

    this.updateSeconds = () => {
      eyesClosed.mesh.position.y += this.grid.unit * 4
      if (this.time.elapsedSeconds === finishAt) this.dispatchEvent({ type: 'transition-end' })
    }

    this.dispose = () => {
      dispose(eyesClosed.mesh)
      this.scene.remove(eyesClosed.mesh)
    }
  }
}
