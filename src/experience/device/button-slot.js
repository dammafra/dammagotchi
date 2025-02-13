import { MeshMatcapMaterial, SphereGeometry } from 'three'
import { Brush } from 'three-bvh-csg'

export default class ButtonSlot {
  static material = null

  constructor({ radius, position }) {
    this.radius = radius
    this.position = position

    this.setGeometry()
    if (!ButtonSlot.material) this.setMaterial()
    this.setMesh()
  }

  setGeometry() {
    this.geometry = new SphereGeometry(this.radius)
  }

  setMaterial() {
    ButtonSlot.material = new MeshMatcapMaterial({ color: 'black' })
  }

  setMesh() {
    this.mesh = new Brush(this.geometry, ButtonSlot.material)
    this.mesh.position.copy(this.position)
    this.mesh.updateMatrixWorld()
  }

  dispose() {
    this.geometry.dispose()
    ButtonSlot.material?.dispose()
  }
}
