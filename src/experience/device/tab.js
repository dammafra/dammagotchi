import { DoubleSide, Mesh, MeshMatcapMaterial, PlaneGeometry } from 'three'

export default class Tab {
  constructor({ width, height, position, rotation, color, visible }) {
    this.width = width
    this.height = height
    this.position = position
    this.rotation = rotation
    this.color = color
    this.visible = visible

    this.setGeometry()
    this.setMaterial()
    this.setMesh()
  }

  setGeometry() {
    this.geometry = new PlaneGeometry(this.width, this.height)
  }

  setMaterial() {
    this.material = new MeshMatcapMaterial({ color: this.color, side: DoubleSide })
  }

  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material || Frame.material)
    this.mesh.visible = this.visible
    this.mesh.position.copy(this.position)
    this.mesh.rotation.setFromVector3(this.rotation)
  }

  dispose() {
    this.geometry.dispose()
    this.material.dispose()
  }
}
