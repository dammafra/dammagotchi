import { GridHelper } from 'three'
import Experience from '../experience'

export default class Room {
  constructor() {
    // Setup
    this.experience = Experience.instance

    this.scene = this.experience.scene
    this.sizes = this.experience.sizes

    this.floor = new GridHelper(this.sizes.gridSize, this.sizes.gridSize, '#888888')

    this.wall = new GridHelper(this.sizes.gridSize, this.sizes.gridSize, '#888888')
    this.wall.rotation.x = -Math.PI * 0.5
    this.wall.position.z = -this.sizes.gridSize / 2
    this.wall.position.y = this.sizes.gridSize / 2

    this.scene.add(this.floor, this.wall)
  }
}
