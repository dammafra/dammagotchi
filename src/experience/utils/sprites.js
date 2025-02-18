import { EventDispatcher } from 'three'
import spritesConfig from '../config/sprites'
import Experience from '../experience'
import Sprite from '../screen/sprite'
import { areColorsNear, rgbToHex } from './colors'

export default class Sprites extends EventDispatcher {
  /** @type {Map<string, Sprites} */
  static instances = new Map()
  static delimiter = '#A616D3'

  static for(sprite) {
    if (Sprites.instances.has(sprite)) {
      const instance = Sprites.instances.get(sprite)
      setTimeout(() => instance.dispatchEvent({ type: 'ready' }))
      return instance
    }
    return new Sprites(sprite)
  }

  constructor(sprite) {
    super()

    Sprites.instances.set(sprite, this)

    this.experience = Experience.instance

    this.loaded = new Map()
    this.img = new Image()
    this.img.src = `sprites/${sprite.split('.').join('/')}.png`
    this.config = this.getConfig(sprite)

    this.img.onload = () => {
      this.extractPixels()
      this.buildMatrix()
      this.setSprites()

      this.dispatchEvent({ type: 'ready' })
    }

    this.img.onerror = () => console.error('Cannot find sprite asset', this.img.src)
  }

  getConfig(path) {
    const config = path.split('.').reduce((acc, property) => acc && acc[property], spritesConfig)
    if (!config) console.error(`Cannot find sprite config '${path}'`)
    return config
  }

  /** @returns {Sprite[]} */
  get(name) {
    if (this.loaded.has(name)) {
      return this.loaded.get(name)
    }

    const config = Array.isArray(this.config) ? this.config.find(c => c.name === name) : this.config
    const sprites = this.splitSprite(config.index, config.split)
    this.loaded.set(name, sprites)
    return sprites
  }

  extractPixels() {
    const canvas = document.createElement('canvas')
    canvas.width = this.img.width
    canvas.height = this.img.height

    const ctx = canvas.getContext('2d', { colorSpace: 'srgb' })
    ctx.drawImage(this.img, 0, 0)

    // prettier-ignore
    this.pixels = ctx.getImageData(0, 0, this.img.width, this.img.height, { colorSpace: 'srgb' }).data
  }

  buildMatrix() {
    this.matrix = []

    for (let y = 0; y < this.img.height; y++) {
      const row = []
      for (let x = 0; x < this.img.width; x++) {
        const color = this.getPixelColor(x, y)
        row.push(rgbToHex(color))
      }
      this.matrix.push(row)
    }
  }

  getPixelColor(x, y) {
    const i = (y * this.img.width + x) * 4
    const r = this.pixels[i]
    const g = this.pixels[i + 1]
    const b = this.pixels[i + 2]
    return { r, g, b }
  }

  setSprites() {
    this.sprites = []

    for (let row = 0; row < this.matrix.length; row++) {
      for (let col = 0; col < this.matrix[0].length; col++) {
        if (this.isDelimiter(this.matrix[row][col])) {
          if (
            (row === 0 || !this.isDelimiter(this.matrix[row - 1][col])) &&
            (col === 0 || !this.isDelimiter(this.matrix[row][col - 1]))
          ) {
            const width = this.getSpriteWidth(row, col)
            const height = this.getSpriteHeight(row, col)
            this.sprites.push({ row, col, width, height })
          }
        }
      }
    }

    return this.sprites
  }

  isDelimiter(pixel) {
    return areColorsNear(Sprites.delimiter, pixel)
  }

  getSpriteWidth(row, col) {
    let width = 1

    while (col + width < this.matrix[0].length && this.isDelimiter(this.matrix[row][col + width])) {
      width++
    }

    return width
  }

  getSpriteHeight(row, col) {
    let height = 1

    while (row + height < this.matrix.length && this.isDelimiter(this.matrix[row + height][col])) {
      height++
    }

    return height
  }

  splitSprite(index, split = 1) {
    if (index < 0 || index >= this.sprites.length) return []

    let { row, col, width, height } = this.sprites[index]
    const splitWidth = Math.floor((width - 2) / split)
    const sprites = []

    let startCol = col + 1
    for (let i = 0; i < split; i++) {
      let subMatrix = []

      const startRow = row + 1
      for (let r = startRow; r < startRow + height - 2; r++) {
        let rowArray = []
        for (let c = startCol; c < startCol + splitWidth; c++) {
          rowArray.push(this.matrix[r][c] === '#000000' ? 1 : 0)
        }
        subMatrix.push(rowArray)
      }

      subMatrix = this.reduce(subMatrix)

      if (this.experience.debug) {
        this.print(subMatrix)
      }

      sprites.push(new Sprite(subMatrix))
      startCol += splitWidth
    }

    return sprites
  }

  reduce(matrix) {
    const rows = matrix.length
    const cols = matrix[0].length

    let top = rows,
      bottom = -1,
      left = cols,
      right = -1

    // Find the bounds of the 1 values
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (matrix[i][j] === 1) {
          top = Math.min(top, i)
          bottom = Math.max(bottom, i)
          left = Math.min(left, j)
          right = Math.max(right, j)
        }
      }
    }

    // If no 1's are found, return an empty matrix or the original one
    if (bottom === -1) return []

    // Create the reduced matrix
    const reducedMatrix = []
    for (let i = top; i <= bottom; i++) {
      reducedMatrix.push(matrix[i].slice(left, right + 1))
    }

    return reducedMatrix
  }

  print(matrix) {
    const chars = matrix.map(row => row.map(pixel => (pixel ? '⬛️' : '⬜️')).join('')).join('\n')
    console.log(chars)

    const count = matrix.reduce((count, row) => count + row.filter(Boolean).length, 0)
    console.log(`Will be rendered using ${count} meshes`)
  }
}
