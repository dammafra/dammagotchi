import { Mesh, MeshMatcapMaterial, SphereGeometry } from 'three'
import Frame from './frame'

export default class Button {
  static material = null

  constructor({ radius, scale, position, rotation, color }) {
    this.radius = radius
    this.scale = scale
    this.position = position
    this.rotation = rotation
    this.color = color

    this.setGeometry()
    if (this.color) this.setMaterial()
    this.setMesh()
  }

  setGeometry() {
    this.geometry = new SphereGeometry(this.radius)
  }

  setMaterial() {
    this.material = new MeshMatcapMaterial({ color: this.color })
  }

  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material || Frame.material)
    this.mesh.scale.copy(this.scale)
    this.mesh.position.copy(this.position)
    this.mesh.rotation.setFromVector3(this.rotation)
  }

  dispose() {
    this.geometry.dispose()
  }
}
