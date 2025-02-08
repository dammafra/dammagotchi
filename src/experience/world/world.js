import Pet from './pet'
// import Egg from './egg'
import sprites from '../config/sprites'
import Environment from './environment'
import Room from './room'

export default class World {
  ready() {
    this.environment = new Environment()
    this.room = new Room()
    // this.egg = new Egg()

    const age = this.getRandom(sprites.pets)
    const model = this.getRandom(sprites.pets[age])

    this.pet = new Pet(age, model)
  }

  updateSeconds() {
    // if (this.egg && this.egg.updateSeconds) this.egg.updateSeconds()
    if (this.pet && this.pet.updateSeconds) this.pet.updateSeconds()
  }

  getRandom(object) {
    const keys = Object.keys(object)
    return keys[Math.floor(Math.random() * keys.length)]
  }
}
