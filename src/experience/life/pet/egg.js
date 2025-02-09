import Pet from './pet'

export default class Egg extends Pet {
  constructor() {
    super('misc')

    this.transitionIn = null
  }

  idle = () => {
    this.dispose && this.dispose()

    const normal = this.sprites.get('egg').at(0)
    normal.spawn()

    const squeezed = this.sprites.get('egg').at(1)
    squeezed.spawn()
    squeezed.mesh.visible = false

    this.updateSeconds = () => {
      normal.mesh.visible = !normal.mesh.visible
      squeezed.mesh.visible = !squeezed.mesh.visible
    }

    this.dispose = () => {
      normal.dispose()
      squeezed.dispose()
    }
  }

  transitionOut = () => {
    this.dispose && this.dispose()

    const hatching = this.sprites.get('egg').at(0)
    hatching.spawn()
    hatching.mesh.visible = true

    this.updateSeconds = () => {
      hatching.mesh.position.x += hatching.mesh.position.x < 0 ? this.grid.unit : -this.grid.unit
    }

    this.dispose = () => {
      hatching.dispose()
    }
  }
}
