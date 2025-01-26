import Experience from '../experience'

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

  print() {
    const chars = this.values
      .map(row => row.map(pixel => (pixel ? '⬛️' : '⬜️')).join(''))
      .join('\n')
    console.log(chars)

    const count = this.values.reduce((count, row) => count + row.filter(Boolean).length, 0)
    console.log(`Will be rendered using ${count} meshes`)
  }
}
