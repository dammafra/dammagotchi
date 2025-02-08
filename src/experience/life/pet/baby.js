import { dispose } from '../../utils/dispose'
import Pet from './pet'

export default class Baby extends Pet {
  constructor(model, transitioning) {
    super('babies', model)

    this.transitioning = transitioning
  }

  ready() {
    this.transitioning ? this.hatching() : this.idle()
  }

  hatching = () => {
    this.dispose && this.dispose()

    const hatching = this.sprites.get('hatching').at(0)
    this.scene.add(hatching.mesh)

    const startedAt = this.time.elapsedSeconds
    const finishAt = startedAt + 2

    this.updateSeconds = () => {
      if (this.time.elapsedSeconds > finishAt) this.idle()
    }

    this.dispose = () => {
      dispose(hatching.mesh)
      this.scene.remove(hatching.mesh)
    }
  }
}
