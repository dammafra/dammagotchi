import Experience from '@experience'
import { Mesh, MeshStandardMaterial, SphereGeometry } from 'three'

export default class Button {
  static geometry = null
  static material = null

  constructor({ radius, scale, position, rotation, color, onPress, onRelease, detach }) {
    this.experience = Experience.instance
    this.pointer = this.experience.pointer

    this.radius = radius
    this.scale = scale
    this.position = position
    this.rotation = rotation
    this.color = color
    this.onPress = onPress
    this.onRelease = onRelease

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

    this.pointer.onClick(this.mesh, { start: this.press, end: this.release })
  }

  press = () => {
    const direction = this.position.z > 0 ? -1 : 1
    this.mesh.position.z = this.position.z + 0.03 * direction
    this.onPress && this.onPress()
  }

  release = () => {
    this.mesh.position.z = this.position.z
    this.onRelease && this.onRelease()
  }

  dispose() {
    this.geometry?.dispose()
    Button.geometry.dispose()

    this.material?.dispose()
    Button.material.dispose()
  }
}
