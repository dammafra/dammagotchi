import { Vector3 } from 'three'

export default class ScreenGrid {
  constructor() {
    this.unit = 0.1
    this.size = 24

    const zeroCoordinate = this.unit / 2
    this.center = new Vector3(zeroCoordinate, zeroCoordinate, zeroCoordinate - this.size / 4)
  }

  contains(position) {
    const maxDistance = Math.abs(this.size / 2)
    return (
      Math.abs(position.x) <= maxDistance &&
      Math.abs(position.y) <= maxDistance &&
      Math.abs(position.z) <= maxDistance
    )
  }
}
