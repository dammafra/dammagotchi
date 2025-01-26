import { Group } from 'three'
import Experience from '../experience'
import Pixel from './pixel'
import Shadow from './shadow'

export default class Matrix {
  constructor(values) {
    this.experience = Experience.instance
    this.sizes = this.experience.sizes

    this.values = values.map(this.pad)
    this.setMesh()

    return this.group
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

  setMesh() {
    this.group = new Group()

    this.values.reverse().forEach((row, y) => {
      row.forEach((pixel, x) => {
        if (!pixel) return
        const centeredX = x - this.sizes.gridSize / 2
        this.group.add(new Pixel(centeredX, y))
      })
    })

    this.group.add(new Shadow())
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
