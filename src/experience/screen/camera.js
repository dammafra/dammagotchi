import { Frustum, Matrix4, PerspectiveCamera } from 'three'

export default class ScreenCamera {
  constructor() {
    // Setup
    this.setInstance()
  }

  setInstance() {
    this.instance = new PerspectiveCamera(50, 1, 0.1, 100)
    this.instance.position.y = 1.4
    this.instance.position.z = -1
  }

  canView(position) {
    const frustum = new Frustum()
    const matrix = new Matrix4().multiplyMatrices(
      this.instance.projectionMatrix,
      this.instance.matrixWorldInverse,
    )
    frustum.setFromProjectionMatrix(matrix)
    return frustum.containsPoint(position)
  }
}
