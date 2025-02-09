import { dispose } from '../../utils/dispose'
import Pet from './pet'

export default class Senior extends Pet {
  constructor(model) {
    super('seniors', model)
  }

  transitionOut = () => {
    this.dispose && this.dispose()

    const eyesClosed = this.sprites.get('eyes-closed').at(0)
    eyesClosed.mesh.visible = true
    eyesClosed.mesh.position.copy(this.grid.center)
    this.scene.add(eyesClosed.mesh)

    this.updateSeconds = () => {
      eyesClosed.mesh.position.y += this.grid.unit * 4
    }

    this.dispose = () => {
      dispose(eyesClosed.mesh)
      this.scene.remove(eyesClosed.mesh)
    }
  }
}
