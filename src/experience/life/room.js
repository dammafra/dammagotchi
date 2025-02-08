import { GridHelper } from 'three'
import Experience from '../experience'

export default class Room {
  constructor() {
    // Setup
    this.experience = Experience.instance

    this.scene = this.experience.scene
    this.grid = this.experience.grid

    this.setFloor()
    this.setWall()
  }

  setFloor() {
    this.floor = new GridHelper(this.grid.size, this.grid.size, '#888888')
    this.scene.add(this.floor)
  }

  setWall() {
    this.wall = new GridHelper(this.grid.size, this.grid.size, '#888888')
    this.wall.rotation.x = -Math.PI * 0.5
    this.wall.position.y = this.grid.size / 2
    this.wall.position.z = -this.grid.size / 2

    this.scene.add(this.wall)
  }
}
