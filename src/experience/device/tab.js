import { DoubleSide, Mesh, MeshStandardMaterial, PlaneGeometry } from 'three'
import Experience from '../experience'

export default class Tab {
  constructor({ width, height, position, visible, onClick }) {
    this.experience = Experience.instance
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

    this.pointer.onClick(this.mesh, this.onClick)
  }

  dispose() {
    this.geometry.dispose()
    this.material.dispose()
  }
}
