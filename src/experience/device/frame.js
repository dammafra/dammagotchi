import { CylinderGeometry, MeshMatcapMaterial } from 'three'
import { Brush } from 'three-bvh-csg'

export default class Frame {
  static material = null

  constructor({
    radiusTop,
    radiusBottom,
    height,
    positionX,
    positionY,
    positionZ,
    rotationY,
    scale,
  }) {
    this.radiusTop = radiusTop
    this.radiusBottom = radiusBottom
    this.height = height
    this.positionX = positionX
    this.positionY = positionY
    this.positionZ = positionZ
    this.rotationY = rotationY
    this.scale = scale

    this.setGeometry()
    if (!Frame.material) this.setMaterial()
    this.setMesh()
  }

  setGeometry() {
    this.geometry = new CylinderGeometry(this.radiusTop, this.radiusBottom, this.height, 4)
  }

  setMaterial() {
    Frame.material = new MeshMatcapMaterial({ color: 'yellow' })
  }

  setMesh() {
    this.mesh = new Brush(this.geometry, Frame.material)
    this.mesh.scale.setScalar(this.scale)
    this.mesh.rotation.y = this.rotationY
    this.mesh.rotation.x = -Math.PI * 0.5
    this.mesh.position.set(this.positionX, this.positionY, this.positionZ)
    this.mesh.updateMatrixWorld()
  }

  dispose() {
    this.geometry.dispose()
    Frame.material?.dispose()
  }
}
