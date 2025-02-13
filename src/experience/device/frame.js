import { CylinderGeometry, MeshMatcapMaterial } from 'three'
import { Brush } from 'three-bvh-csg'

export default class Frame {
  constructor({ radiusTop, radiusBottom, height, positionX, positionY, positionZ }) {
    this.radiusTop = radiusTop
    this.radiusBottom = radiusBottom
    this.height = height
    this.positionX = positionX
    this.positionY = positionY
    this.positionZ = positionZ

    this.setMaterial()
    this.setGeometry()
    this.setMesh()
  }

  setMaterial() {
    this.material = new MeshMatcapMaterial({ color: 'yellow' })
  }

  setGeometry() {
    this.geometry = new CylinderGeometry(this.radiusTop, this.radiusBottom, this.height, 4)
  }

  setMesh() {
    this.mesh = new Brush(this.geometry, this.material)
    this.mesh.rotation.y = Math.PI * 0.25
    this.mesh.rotation.x = -Math.PI * 0.5
    this.mesh.position.set(this.positionX, this.positionY, this.positionZ)
    this.mesh.updateMatrixWorld()
  }

  dispose() {
    this.geometry.dispose()
    this.material.dispose()
  }
}
