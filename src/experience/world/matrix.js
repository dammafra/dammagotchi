import { Group } from 'three'
import Experience from '../experience'
import Pixel from './pixel'

export default class Matrix {
  constructor(values) {
    this.experience = Experience.instance
    this.sizes = this.experience.sizes

    this.values = values.map(this.pad)
  }

  pad = row => {
    const padValue = 0
    const targetLength = this.sizes.gridSize

    if (row.length >= targetLength) return row

    const totalPadding = targetLength - row.length
    const startPadding = Math.ceil(totalPadding / 2)
    const endPadding = totalPadding - startPadding

    return Array(startPadding).fill(padValue).concat(row).concat(Array(endPadding).fill(padValue))
  }

  build() {
    this.group = new Group()

    this.values.reverse().forEach((row, y) => {
      row.forEach((pixel, x) => {
        if (!pixel) return
        const pixelMesh = new Pixel(x - this.sizes.gridSize / 2, y)
        this.group.add(pixelMesh.mesh)
      })
    })

    return this.group
  }

  print() {
    const chars = this.values
      .map(row => row.map(pixel => (pixel ? '⬛️' : '⬜️')).join(''))
      .join('\n')
    console.log(chars)

    const count = this.values.reduce((count, row) => count + row.filter(Boolean).length, 0)
    console.log(`Will be rendered using ${count} meshes`)
  }
}
