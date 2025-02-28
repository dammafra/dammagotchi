import Experience from '@experience'
import { CircleGeometry, DoubleSide, MeshBasicMaterial, PlaneGeometry } from 'three'
import { ADDITION, Brush } from 'three-bvh-csg'
import Device from './device'

export default class Tab {
  constructor({ width, height, radius, position, onPull }) {
    this.experience = Experience.instance
    this.resources = this.experience.resources
    this.scene = this.experience.scene
    this.time = this.experience.time
    this.pointer = this.experience.pointer

    this.width = width
    this.height = height
    this.radius = radius
    this.position = position
    this.onPull = onPull

    this.pulling = false

    this.setGeometry()
    this.setMaterial()
    this.setMesh()
  }

  setGeometry() {
    this.planeGeometry = new PlaneGeometry(this.width, this.height)
    this.circleGeometry = new CircleGeometry(this.radius)
  }

  setMaterial() {
    this.planeMaterial = new MeshBasicMaterial({
      color: 'white',
      side: DoubleSide,
      transparent: true,
    })

    this.circleMaterial = new MeshBasicMaterial({
      side: DoubleSide,
      map: this.resources.items.tab,
    })
  }

  setMesh() {
    this.circle = new Brush(this.circleGeometry, this.circleMaterial)
    this.circle.position.x = this.radius
    this.circle.updateMatrixWorld()

    this.plane = new Brush(this.planeGeometry, this.planeMaterial)
    this.plane.updateMatrixWorld()

    this.mesh = Device.evaluator.evaluate(this.circle, this.plane, ADDITION)
    this.mesh.position.copy(this.position)
    this.mesh.castShadow = false

    this.pointer.onDrag(this.mesh, this.pull)
  }

  pull = () => {
    this.mesh.position.y = this.position.y
    this.mesh.position.z = this.position.z
    if (this.mesh.position.x < this.position.x) {
      this.mesh.position.x = this.position.x
    } else if (this.mesh.position.x > this.position.x + 0.2) {
      this.pulling = true
    }
  }

  update() {
    if (!this.pulling) return

    this.mesh.position.x += this.time.elapsed * 0.005
    this.mesh.material.forEach(m => (m.opacity -= this.time.elapsed * 0.003))
    if (this.mesh.material.at(0).opacity < 0) this.onPull()
  }

  dispose() {
    this.circleGeometry.dispose()
    this.planeGeometry.dispose()
    this.circleMaterial.dispose()
    this.planeMaterial.dispose()
    this.pointer.cancelDrag(this.mesh)
    this.scene.remove(this.mesh)
  }
}
