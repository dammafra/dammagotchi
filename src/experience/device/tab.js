import { DoubleSide, Mesh, MeshStandardMaterial, PlaneGeometry } from 'three'
import Experience from '../experience'

export default class Tab {
  constructor({ width, height, position, visible, onClick }) {
    this.experience = Experience.instance
    this.scene = this.experience.scene
    this.time = this.experience.time
    this.pointer = this.experience.pointer

    this.width = width
    this.height = height
    this.position = position
    this.visible = visible
    this.onClick = onClick

    this.setGeometry()
    this.setMaterial()
    this.setMesh()
  }

  setGeometry() {
    this.geometry = new PlaneGeometry(this.width, this.height)
  }

  setMaterial() {
    this.material = new MeshStandardMaterial({
      side: DoubleSide,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.8,
    })
  }

  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material || Frame.material)
    this.mesh.visible = this.visible
    this.mesh.position.copy(this.position)
    this.mesh.castShadow = true

    this.pointer.onClick(this.mesh, this.pull)
  }

  pull = () => {
    this.pulled = true
  }

  update() {
    if (!this.pulled) return

    this.mesh.position.x += this.time.elapsed * 0.005
    this.mesh.material.opacity -= this.time.elapsed * 0.003
    if (this.mesh.material.opacity < 0) {
      this.pulled = false
      this.onClick()
      this.dispose()
    }
  }

  dispose() {
    this.geometry.dispose()
    this.material.dispose()
    this.scene.remove(this.mesh)
  }
}
