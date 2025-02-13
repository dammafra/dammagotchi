import { LatheGeometry, MeshMatcapMaterial, Vector2 } from 'three'
import { Brush } from 'three-bvh-csg'
import { degToRad } from 'three/src/math/MathUtils.js'

export default class Shell {
  static material = null

  constructor({ girth, apex, scaleZ }) {
    this.girth = girth
    this.apex = apex
    this.scaleZ = scaleZ

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
    Shell.material = new MeshMatcapMaterial({ color: 'lightblue' })
  }

  setMesh() {
    this.mesh = new Brush(this.geometry, Shell.material)
    this.mesh.scale.z = this.scaleZ
    this.mesh.updateMatrixWorld()
  }

  dispose() {
    this.geometry.dispose()
    Shell.material?.dispose()
  }
}
