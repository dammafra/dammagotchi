import { Vector3 } from 'three'

export default class Grid {
  constructor() {
    this.unit = 0.1
    this.size = 24

    const zeroCoordinate = this.unit / 2
    this.center = new Vector3(zeroCoordinate, zeroCoordinate, zeroCoordinate - this.size / 4)
  }
}
