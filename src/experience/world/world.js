import Egg from './egg'
import Environment from './environment'
import Room from './room'

export default class World {
  ready() {
    this.environment = new Environment()
    this.room = new Room()
    this.egg = new Egg()
  }

  updateSeconds() {
    if (this.egg) this.egg.updateSeconds()
  }
}
