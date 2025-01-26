import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three'
import Experience from '../experience'

export default class Pixel {
  constructor() {
    // Setup
    this.experience = Experience.instance

    this.scene = this.experience.scene
    this.sizes = this.experience.sizes

    this.setGeometry()
    this.setMaterial()
    this.setMesh()
  }

  setGeometry() {
    this.geometry = new BoxGeometry(this.sizes.unit, this.sizes.unit, this.sizes.unit)
  }

  setMaterial() {
    this.material = new MeshBasicMaterial({
      color: 'black',
    })
  }

  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material)
    this.mesh.position.setScalar(this.sizes.unit / 2)
    this.scene.add(this.mesh)
  }
}
