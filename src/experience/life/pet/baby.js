import { dispose } from '../../utils/dispose'
import Pet from './pet'

export default class Baby extends Pet {
  constructor(model, transitioning) {
    super('babies', model, transitioning)
  }

  transitionIn = () => {
    this.dispose && this.dispose()

    const hatching = this.sprites.get('hatching').at(0)
    this.scene.add(hatching.mesh)

    this.time.runAfterSeconds(this.idle, this.config.transitions.babies.in)

    this.updateSeconds = () => {}

    this.dispose = () => {
      dispose(hatching.mesh)
      this.scene.remove(hatching.mesh)
    }
  }
}
