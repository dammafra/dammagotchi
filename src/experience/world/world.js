import Experience from '../experience'
import Egg from './egg'
import Environment from './environment'
import Room from './room'

export default class World {
  constructor() {
    // Setup
    this.experience = Experience.instance

    this.scene = this.experience.scene
    this.resources = this.experience.resources

    this.resources.addEventListener('ready', () => {
      this.room = new Room()
      this.egg = new Egg()
      this.environment = new Environment()
    })
  }

  updateSeconds() {
    if (this.egg) this.egg.updateSeconds()
  }
}
