import { DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'
import Experience from '../experience'

export default class Pixel {
  static geometry = null
  static material = null

  constructor(x, y) {
    // Setup
    this.experience = Experience.instance
    this.screen = this.experience.screen

    if (!Pixel.geometry) this.setGeometry()
    if (!Pixel.material) this.setMaterial()

    this.setMesh(x, y)
  }

  setGeometry() {
    Pixel.geometry = new PlaneGeometry(this.screen.unit, this.screen.unit)
  }

  setMaterial() {
    Pixel.material = new MeshBasicMaterial({ color: 'black', side: DoubleSide })
  }

  setMesh(x, y) {
    this.mesh = new Mesh(Pixel.geometry, Pixel.material)

    this.mesh.position.x = x * this.screen.unit
    this.mesh.position.y = y * this.screen.unit
  }
}
