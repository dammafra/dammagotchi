import { Mesh, MeshStandardMaterial, SphereGeometry } from 'three'
import Experience from '../experience'

export default class Button {
  static geometry = null
  static material = null

  constructor({ radius, scale, position, rotation, color, onClick, detach }) {
    this.experience = Experience.instance
    this.pointer = this.experience.pointer

    this.radius = radius
    this.scale = scale
    this.position = position
    this.rotation = rotation
    this.color = color
    this.onClick = onClick

    if (detach || !Button.geometry) this.setGeometry(detach)
    if (detach || !Button.material) this.setMaterial(detach)
    this.setMesh()
  }

  setGeometry(detach) {
    const geometry = new SphereGeometry(this.radius)
    detach ? (this.geometry = geometry) : (Button.geometry = geometry)
  }

  setMaterial(detach) {
    const material = new MeshStandardMaterial({ color: this.color, metalness: 0, roughness: 0.7 })
    detach ? (this.material = material) : (Button.material = material)
  }

  setMesh() {
    this.mesh = new Mesh(this.geometry || Button.geometry, this.material || Button.material)
    this.mesh.scale.copy(this.scale)
    this.mesh.position.copy(this.position)
    this.mesh.rotation.setFromVector3(this.rotation)

    this.pointer.onClick(this.mesh, this.push)
  }

  push = () => {
    const direction = this.mesh.position.z > 0 ? -0.03 : +0.03

    this.mesh.position.z += direction
    setTimeout(() => {
      this.mesh.position.z -= direction
    }, 100)

    this.onClick()
  }

  dispose() {
    this.geometry?.dispose()
    Button.geometry.dispose()

    this.material?.dispose()
    Button.material.dispose()
  }
}
