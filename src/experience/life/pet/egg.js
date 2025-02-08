import lifeConfig from '../../config/life'
import Experience from '../../experience'
import { dispose } from '../../utils/dispose'
import Sprites from '../../utils/sprites'
import Time from '../../utils/time'

export default class Egg {
  static debugName = '🥚 egg'

  constructor() {
    this.experience = Experience.instance
    this.time = Time.instance

    this.grid = this.experience.grid
    this.scene = this.experience.scene

    this.sprites = Sprites.for('misc')
    this.sprites.addEventListener('ready', this.idle)
  }

  idle = () => {
    this.dispose && this.dispose()

    const normal = this.sprites.get('egg').at(0)
    const squeezed = this.sprites.get('egg').at(1)
    squeezed.mesh.visible = false

    this.scene.add(normal.mesh, squeezed.mesh)

    const startedAt = this.time.elapsedSeconds
    const finishAt = startedAt + lifeConfig.stages.egg / 3

    this.updateSeconds = () => {
      normal.mesh.visible = !normal.mesh.visible
      squeezed.mesh.visible = !squeezed.mesh.visible

      if (this.time.elapsedSeconds > finishAt) this.hatching()
    }

    this.dispose = () => {
      dispose(normal.mesh)
      dispose(squeezed.mesh)
      this.scene.remove(normal.mesh, squeezed.mesh)
    }
  }

  hatching = () => {
    this.dispose && this.dispose()

    const hatching = this.sprites.get('egg').at(0)
    hatching.mesh.visible = true
    this.scene.add(hatching.mesh)

    this.updateSeconds = () => {
      hatching.mesh.position.x += hatching.mesh.position.x < 0 ? this.grid.unit : -this.grid.unit
    }

    this.dispose = () => {
      dispose(hatching.mesh)
      this.scene.remove(hatching.mesh)
    }
  }
}
