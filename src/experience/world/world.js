import Experience from '../experience'
import Egg from './egg'
import Environment from './environment'
import Floor from './floor'

export default class World {
  constructor() {
    // Setup
    this.experience = Experience.instance

    this.scene = this.experience.scene
    this.resources = this.experience.resources

    this.resources.addEventListener('ready', () => {
      this.floor = new Floor()
      this.egg = new Egg()
      this.environment = new Environment()
    })
  }

  update() {}
}
