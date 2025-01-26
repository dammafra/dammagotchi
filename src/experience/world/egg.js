import { Group } from 'three'
import Experience from '../experience'
import matrices from '../matrices'
import Matrix from './matrix'

export default class Egg {
  constructor() {
    this.experience = Experience.instance

    this.sizes = this.experience.sizes
    this.time = this.experience.time
    this.lastTime = 0
    this.scene = this.experience.scene

    this.group = new Group()

    this.normal = new Matrix(matrices.egg.normal).build()
    this.squeezed = new Matrix(matrices.egg.squeezed).build()
    this.squeezed.visible = false

    this.scene.add(this.normal, this.squeezed)
  }

  update() {
    const currentTime = Math.floor(this.time.elapsed / 1000)

    if (this.lastTime < currentTime) {
      this.normal.visible = !this.normal.visible
      this.squeezed.visible = !this.squeezed.visible
    }

    this.lastTime = currentTime
  }
}
