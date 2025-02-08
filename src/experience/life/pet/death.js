import Experience from '../../experience'
import { dispose } from '../../utils/dispose'
import Sprites from '../../utils/sprites'

export default class Death {
  constructor() {
    this.experience = Experience.instance

    this.grid = this.experience.grid
    this.scene = this.experience.scene

    this.sprites = Sprites.for('misc')
  }

  ready() {
    this.idle()
  }

  idle = () => {
    this.dispose && this.dispose()

    const death = this.sprites.get('death').at(0)

    this.scene.add(death.mesh)

    this.updateSeconds = () => {
      death.mesh.position.y += death.mesh.position.y < 0 ? this.grid.unit : -this.grid.unit
    }

    this.dispose = () => {
      dispose(death.mesh)
      this.scene.remove(death.mesh)
    }
  }
}
