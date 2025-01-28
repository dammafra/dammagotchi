import { Mesh, MeshBasicMaterial, PlaneGeometry, SRGBColorSpace } from 'three'
import Experience from '../experience'

export default class Shadow {
  static geometry = null
  static material = null

  constructor(x, y) {
    // Setup
    this.experience = Experience.instance
    this.sizes = this.experience.sizes
    this.resources = this.experience.resources

    if (!Shadow.geometry) this.setGeometry()
    if (!Shadow.material) this.setMaterial()

    this.setMesh()
    return this.mesh
  }

  setGeometry() {
    Shadow.geometry = new PlaneGeometry(this.sizes.unit * 20, this.sizes.unit * 20)
  }

  setMaterial() {
    const shadow = this.resources.items.shadow
    shadow.colorSpace = SRGBColorSpace

    Shadow.material = new MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      alphaMap: shadow,
    })
  }

  setMesh() {
    this.mesh = new Mesh(Shadow.geometry, Shadow.material)

    this.mesh.rotation.x = -Math.PI * 0.5
    this.mesh.position.y += 0.01
  }
}
