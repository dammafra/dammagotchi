import { CylinderGeometry, MeshMatcapMaterial, SRGBColorSpace } from 'three'
import { Brush } from 'three-bvh-csg'
import Experience from '../experience'

export default class Frame {
  static material = null

  constructor({ radiusTop, radiusBottom, height, position, rotation }) {
    this.experience = Experience.instance
    this.resources = this.experience.resources

    this.radiusTop = radiusTop
    this.radiusBottom = radiusBottom
    this.height = height
    this.position = position
    this.rotation = rotation

    this.setGeometry()
    if (!Frame.material) this.setMaterial()
    this.setMesh()
  }

  setGeometry() {
    this.geometry = new CylinderGeometry(this.radiusTop, this.radiusBottom, this.height, 4)
  }

  setMaterial() {
    const matcap = this.resources.items.frameTexture
    matcap.colorSpace = SRGBColorSpace
    Frame.material = new MeshMatcapMaterial({ matcap })
  }

  setMesh() {
    this.mesh = new Brush(this.geometry, Frame.material)
    this.mesh.position.copy(this.position)
    this.mesh.rotation.setFromVector3(this.rotation)
    this.mesh.updateMatrixWorld()
  }

  dispose() {
    this.geometry.dispose()
    Frame.material?.dispose()
  }
}
