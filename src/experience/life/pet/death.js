import { dispose } from '../../utils/dispose'
import Pet from './pet'

export default class Death extends Pet {
  constructor() {
    super('misc')

    this.transitionIn = null
    this.transitionOut = null
  }

  idle = () => {
    this.dispose && this.dispose()

    const death = this.sprites.get('death').at(0)

    this.scene.add(death.mesh)

    this.updateSeconds = () => {
      death.mesh.position.y +=
        death.mesh.position.y > this.grid.unit ? -this.grid.unit : +this.grid.unit
    }

    this.dispose = () => {
      dispose(death.mesh)
      this.scene.remove(death.mesh)
    }
  }
}
