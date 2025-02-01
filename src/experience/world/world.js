import Experience from '../experience'
import Environment from './environment'
import Pet from './pet'
import Room from './room'

export default class World {
  constructor() {
    // Setup
    this.experience = Experience.instance

    this.scene = this.experience.scene
    this.resources = this.experience.resources

    this.resources.addEventListener('ready', () => {
      this.room = new Room()
      this.pet = new Pet()
      this.environment = new Environment()
    })
  }

  updateSeconds() {
    if (this.pet) this.pet.updateSeconds()
  }
}
