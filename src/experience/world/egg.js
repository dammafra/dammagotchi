import { Group } from 'three'
import Experience from '../experience'
import Matrix from './matrix'
import Pixel from './pixel'

export default class Egg {
  constructor() {
    this.experience = Experience.instance

    this.sizes = this.experience.sizes
    this.scene = this.experience.scene

    this.group = new Group()
    this.matrix = new Matrix([
      [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 1, 0, 1, 0, 0, 1, 0, 0],
      [0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 1, 1, 0],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 0, 1, 0, 0, 1],
      [1, 1, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
      [0, 1, 0, 0, 0, 0, 1, 0, 1, 0],
      [0, 0, 1, 0, 0, 1, 0, 1, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
    ])

    this.build()
  }

  build() {
    this.group = new Group()
    this.scene.add(this.group)

    this.matrix.values.reverse().forEach((row, y) => {
      row.forEach((pixel, x) => {
        if (!pixel) return
        const pixelMesh = new Pixel(x - this.sizes.gridSize / 2, y)
        this.group.add(pixelMesh.mesh)
      })
    })
  }
}
