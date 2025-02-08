import { Group } from 'three'
import Experience from '../experience'
import Pixel from './pixel'

export default class Sprite {
  constructor(values) {
    this.experience = Experience.instance
    this.grid = this.experience.grid

    this.setMesh(values)
  }

  setMesh(values) {
    this.mesh = new Group()
    this.mesh.position.copy(this.grid.center)

    values.toReversed().forEach((row, y) => {
      row.forEach((pixel, x) => {
        if (!pixel) return
        const centeredX = x - this.grid.size / 2
        this.mesh.add(new Pixel(centeredX, y).mesh)
      })
    })
  }
}
