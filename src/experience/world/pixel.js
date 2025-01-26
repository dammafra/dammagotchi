import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three'
import Experience from '../experience'

export default class Pixel {
  constructor() {
    // Setup
    this.experience = Experience.instance

    this.scene = this.experience.scene

    this.setGeometry()
    this.setMaterial()
    this.setMesh()
  }

  setGeometry() {
    this.geometry = new BoxGeometry(0.5, 0.5, 0.5)
  }

  setMaterial() {
    this.material = new MeshBasicMaterial({
      color: 'black',
    })
  }

  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material)
    this.mesh.position.setScalar(0.5 / 2)
    this.scene.add(this.mesh)
  }
}
