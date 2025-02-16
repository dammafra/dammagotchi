import { Mesh, MeshStandardMaterial, SphereGeometry } from 'three'
import Experience from '../experience'
import Frame from './frame'

export default class Button {
  static material = null

  constructor({ radius, scale, position, rotation, color, onClick }) {
    this.experience = Experience.instance
    this.pointer = this.experience.pointer

    this.radius = radius
    this.scale = scale
    this.position = position
    this.rotation = rotation
    this.color = color
    this.onClick = onClick

    this.setGeometry()
    this.setMaterial()
    this.setMesh()
  }

  setGeometry() {
    this.geometry = new SphereGeometry(this.radius)
  }

  setMaterial() {
    this.material = new MeshStandardMaterial({ color: this.color, metalness: 0, roughness: 0.7 })
  }

  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material || Frame.material)
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
    this.geometry.dispose()
    this.material.dispose()
  }
}
