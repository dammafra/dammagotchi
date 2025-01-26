import Experience from '../experience'
import Environment from './environment'
import Floor from './floor'
import Pixel from './pixel'

export default class World {
  constructor() {
    // Setup
    this.experience = Experience.instance

    this.scene = this.experience.scene
    this.resources = this.experience.resources

    this.resources.addEventListener('ready', () => {
      this.floor = new Floor()
      this.pixel = new Pixel()
      this.environment = new Environment()
    })
  }

  update() {}
}
