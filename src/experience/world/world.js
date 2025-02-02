import Environment from './environment'
import Pet from './pet'
import Room from './room'

export default class World {
  constructor() {
    this.room = new Room()
    this.pet = new Pet()
  }

  ready() {
    this.environment = new Environment()
  }

  updateSeconds() {
    if (this.pet) this.pet.updateSeconds()
  }
}
