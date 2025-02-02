import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three'
import Experience from '../experience'

export default class Pixel {
  static geometry = null
  static material = null

  constructor(x, y) {
    // Setup
    this.experience = Experience.instance

    this.grid = this.experience.grid

    if (!Pixel.geometry) this.setGeometry()
    if (!Pixel.material) this.setMaterial()

    this.setMesh(x, y)
  }

  setGeometry() {
    Pixel.geometry = new BoxGeometry(this.grid.unit, this.grid.unit, this.grid.unit)
  }

  setMaterial() {
    Pixel.material = new MeshBasicMaterial({
      color: 'black',
    })
  }

  setMesh(x, y) {
    this.mesh = new Mesh(Pixel.geometry, Pixel.material)

    this.mesh.position.x = x * this.grid.unit
    this.mesh.position.y = y * this.grid.unit
  }
}
