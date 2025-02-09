import { dispose } from '../../utils/dispose'
import Pet from './pet'

export default class Baby extends Pet {
  constructor(model) {
    super('babies', model)
  }

  transitionIn = () => {
    this.dispose && this.dispose()

    const hatching = this.sprites.get('hatching').at(0)
    this.scene.add(hatching.mesh)

    this.updateSeconds = () => {}

    this.dispose = () => {
      dispose(hatching.mesh)
      this.scene.remove(hatching.mesh)
    }
  }
}
