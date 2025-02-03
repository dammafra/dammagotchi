import Pet, { PetAge } from './pet'
// import Egg from './egg'
import Environment from './environment'
import Room from './room'

export default class World {
  ready() {
    this.environment = new Environment()
    this.room = new Room()
    // this.egg = new Egg()
    this.pet = new Pet(PetAge.TEENAGER, 'hinatchi')
  }

  updateSeconds() {
    // if (this.egg && this.egg.updateSeconds) this.egg.updateSeconds()
    if (this.pet && this.pet.updateSeconds) this.pet.updateSeconds()
  }
}
