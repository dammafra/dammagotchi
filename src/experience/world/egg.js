import Experience from '../experience'
import matrices from '../matrices'
import Matrix from './matrix'

export default class Egg {
  constructor() {
    this.experience = Experience.instance

    this.sizes = this.experience.sizes
    this.scene = this.experience.scene

    this.normal = new Matrix(matrices.egg.normal).build()
    this.squeezed = new Matrix(matrices.egg.squeezed).build()
    this.squeezed.visible = false

    this.scene.add(this.normal, this.squeezed)
  }

  updateSeconds() {
    this.normal.visible = !this.normal.visible
    this.squeezed.visible = !this.squeezed.visible
  }
}
