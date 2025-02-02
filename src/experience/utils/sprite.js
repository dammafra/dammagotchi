import { Group } from 'three'
import Experience from '../experience'
import Pixel from '../world/pixel'

export default class Sprite {
  constructor(values) {
    this.experience = Experience.instance
    this.grid = this.experience.grid

    this.values = values.map(this.pad).reverse()
    this.setMesh()
  }

  pad = row => {
    const padValue = 0
    const targetLength = this.grid.size

    if (row.length >= targetLength) return row

    const totalPadding = targetLength - row.length
    const startPadding = Math.ceil(totalPadding / 2)
    const endPadding = totalPadding - startPadding

    return Array(startPadding).fill(padValue).concat(row).concat(Array(endPadding).fill(padValue))
  }

  setMesh() {
    this.mesh = new Group()

    const zeroCoordinate = this.grid.unit / 2
    this.mesh.position.x = zeroCoordinate
    this.mesh.position.y = zeroCoordinate
    this.mesh.position.z = zeroCoordinate - this.grid.size / 4

    this.values.forEach((row, y) => {
      row.forEach((pixel, x) => {
        if (!pixel) return
        const centeredX = x - this.grid.size / 2
        this.mesh.add(new Pixel(centeredX, y).mesh)
      })
    })

    return this.mesh
  }

  print() {
    const chars = this.values
      .reverse()
      .map(row => row.map(pixel => (pixel ? '⬛️' : '⬜️')).join(''))
      .join('\n')
    console.log(chars)

    const count = this.values.reduce((count, row) => count + row.filter(Boolean).length, 0)
    console.log(`Will be rendered using ${count} meshes`)
  }
}
