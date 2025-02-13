import { BoxGeometry, TorusGeometry } from 'three'
import { Brush, SUBTRACTION } from 'three-bvh-csg'
import Device from './device'
import Shell from './shell'

export default class Notch {
  constructor({ radius, tube, scaleY, positionY, rotationX, cut }) {
    this.radius = radius
    this.tube = tube
    this.scaleY = scaleY
    this.positionY = positionY
    this.rotationX = rotationX
    this.cut = cut

    this.setGeometry()
    this.setMesh()
  }

  setGeometry() {
    this.torusGeometry = new TorusGeometry(this.radius, this.tube)
    this.boxGeometry = new BoxGeometry(this.cut, this.cut, this.cut)
  }

  setMesh() {
    this.torus = new Brush(this.torusGeometry, Shell.material)
    this.torus.scale.y = this.scaleY
    this.torus.position.y = this.positionY
    this.torus.rotation.x = this.rotationX
    this.torus.updateMatrixWorld()

    this.box = new Brush(this.boxGeometry, Shell.material)
    this.box.position.z = -(this.cut / 2)
    this.box.updateMatrixWorld()

    this.mesh = Device.evaluator.evaluate(this.torus, this.box, SUBTRACTION)
  }

  dispose() {
    this.torusGeometry.dispose()
    this.boxGeometry.dispose()
  }
}
