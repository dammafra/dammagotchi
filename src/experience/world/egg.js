import Experience from '../experience'
import matrices from '../matrices'
import Matrix from './matrix'

export default class Egg {
  constructor() {
    this.experience = Experience.instance

    this.sizes = this.experience.sizes
    this.scene = this.experience.scene

    this.normal = new Matrix(matrices.egg.normal)
    this.squeezed = new Matrix(matrices.egg.squeezed)
    this.squeezed.mesh.visible = false

    this.scene.add(this.normal.mesh, this.squeezed.mesh)
  }

  updateSeconds() {
    this.normal.mesh.visible = !this.normal.mesh.visible
    this.squeezed.mesh.visible = !this.squeezed.mesh.visible
  }

  rotate() {
    this.normal.mesh.rotation.y += Math.PI
    this.normal.mesh.position.x = -this.normal.mesh.position.x
  }
}
