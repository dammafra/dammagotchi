import Pet from './pet'

export default class Baby extends Pet {
  constructor(model) {
    super('babies', model)
  }

  transitionIn = () => {
    this.dispose && this.dispose()

    const hatching = this.sprites.get('hatching').at(0)
    hatching.spawn()

    this.updateSeconds = null

    this.dispose = () => {
      hatching.dispose()
    }
  }
}
