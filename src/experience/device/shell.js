import { LatheGeometry, MeshStandardMaterial, Vector2 } from 'three'
import { Brush } from 'three-bvh-csg'
import { degToRad } from 'three/src/math/MathUtils.js'
import Experience from '../experience'

export default class Shell {
  static material = null

  constructor({ girth, apex, scale }) {
    this.experience = Experience.instance
    this.resources = this.experience.resources

    this.girth = girth
    this.apex = apex
    this.scale = scale

    this.setGeometry()
    if (!Shell.material) this.setMaterial()
    this.setMesh()
  }

  setGeometry() {
    const points = []
    for (let deg = 0; deg <= 180; deg += 6) {
      const rad = degToRad(deg)
      const point = new Vector2(
        (this.apex * Math.cos(rad) + this.girth) * Math.sin(rad),
        -Math.cos(rad),
      )
      points.push(point)
    }
    this.geometry = new LatheGeometry(points, 100)
  }

  setMaterial() {
    Shell.material = new MeshStandardMaterial({ color: '#224488', metalness: 0, roughness: 0.2 })
  }

  setMesh() {
    this.mesh = new Brush(this.geometry, Shell.material)
    this.mesh.scale.copy(this.scale)
    this.mesh.updateMatrixWorld()
  }

  dispose() {
    this.geometry.dispose()
    Shell.material?.dispose()
  }
}
