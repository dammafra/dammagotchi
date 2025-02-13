import { LatheGeometry, MeshMatcapMaterial, Vector2 } from 'three'
import { Brush } from 'three-bvh-csg'
import { degToRad } from 'three/src/math/MathUtils.js'

export default class Shell {
  constructor({ girth, apex, scaleZ }) {
    this.girth = girth
    this.apex = apex
    this.scaleZ = scaleZ

    this.setMaterial()
    this.setGeometry()
    this.setMesh()
  }

  setMaterial() {
    this.material = new MeshMatcapMaterial({ color: 'lightblue' })
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

  setMesh() {
    this.mesh = new Brush(this.geometry, this.material)
    this.mesh.scale.z = this.scaleZ
    this.mesh.updateMatrixWorld()
  }

  dispose() {
    this.geometry.dispose()
    this.material.dispose()
  }
}
