import Environment from './environment'
import Pet from './pet'
import Room from './room'

export default class World {
  ready() {
    this.environment = new Environment()
    this.room = new Room()
    this.pet = new Pet()
  }

  updateSeconds() {
    if (this.pet) this.pet.updateSeconds()
  }
}
