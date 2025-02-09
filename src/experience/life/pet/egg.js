import { dispose } from '../../utils/dispose'
import Pet from './pet'

export default class Egg extends Pet {
  constructor() {
    super('misc')
  }

  idle = () => {
    this.dispose && this.dispose()

    const normal = this.sprites.get('egg').at(0)
    const squeezed = this.sprites.get('egg').at(1)
    squeezed.mesh.visible = false

    this.scene.add(normal.mesh, squeezed.mesh)

    this.updateSeconds = () => {
      normal.mesh.visible = !normal.mesh.visible
      squeezed.mesh.visible = !squeezed.mesh.visible
    }

    this.dispose = () => {
      dispose(normal.mesh)
      dispose(squeezed.mesh)
      this.scene.remove(normal.mesh, squeezed.mesh)
    }
  }

  transitionOut = () => {
    this.dispose && this.dispose()

    const hatching = this.sprites.get('egg').at(0)
    hatching.mesh.visible = true
    this.scene.add(hatching.mesh)

    this.time.runAfterSeconds(
      () => this.dispatchEvent({ type: 'transition-end' }),
      this.config.transitions.egg.out,
    )

    this.updateSeconds = () => {
      hatching.mesh.position.x += hatching.mesh.position.x < 0 ? this.grid.unit : -this.grid.unit
    }

    this.dispose = () => {
      dispose(hatching.mesh)
      this.scene.remove(hatching.mesh)
    }
  }
}
