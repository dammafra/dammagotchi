import Pet from './pet'

export default class Death extends Pet {
  constructor() {
    super('death')

    this.evolveIn = null
    this.evolveOut = null
    this.eat = null
  }

  idle = () => {
    this.dispose && this.dispose()

    const death = this.sprites.get('death').at(0)
    death.spawn()

    const startPositionY = 0.8
    death.mesh.position.y = startPositionY

    this.updateSeconds = () => {
      death.mesh.position.y +=
        death.mesh.position.y > startPositionY ? -this.screen.unit : +this.screen.unit
    }

    this.dispose = () => {
      death.dispose()
    }
  }
}
