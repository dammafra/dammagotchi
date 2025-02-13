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
    death.spawn()

    const startPositionY = 0.5
    death.mesh.position.y = startPositionY

    this.updateSeconds = () => {
      death.mesh.position.y +=
        death.mesh.position.y > startPositionY ? -this.grid.unit : +this.grid.unit
    }

    this.dispose = () => {
      death.dispose()
    }
  }
}
