import Experience from '@experience'
import { dispose } from '@utils/dispose'
import { Group } from 'three'
import Pixel from './pixel'

export default class Sprite {
  constructor(matrix) {
    this.experience = Experience.instance
    this.life = this.experience.life

    this.screen = this.experience.screen
    this.group = this.experience.life.group

    this.matrix = matrix
    this.setMesh()
  }

  setMesh() {
    this.mesh = new Group()
    this.mesh.position.copy(this.screen.center)

    this.width = this.matrix.at(0).length

    this.matrix.toReversed().forEach((row, y) => {
      row.forEach((pixel, x) => {
        if (!pixel) return
        const centeredX = x - this.width / 2
        this.mesh.add(new Pixel(centeredX, y).mesh)
      })
    })
  }

  spawn() {
    this.reset()
    this.group.add(this.mesh)
  }

  reset() {
    this.mesh.visible = true
    this.mesh.rotation.set(0, 0, 0)
    this.mesh.position.copy(this.screen.center)
  }

  copy(sprite) {
    this.mesh.visible = sprite.mesh.visible
    this.mesh.rotation.copy(sprite.mesh.rotation)
    this.mesh.position.copy(sprite.mesh.position)
  }

  clone() {
    return new Sprite(this.matrix)
  }

  boundsAt(position) {
    const leftBound = position.clone()
    leftBound.x += -this.screen.unit * (this.width / 2)

    const rightBound = position.clone()
    rightBound.x += this.screen.unit * (this.width / 2)

    return { leftBound, rightBound }
  }

  dispose() {
    this.reset()
    dispose(this.mesh)
    this.group.remove(this.mesh)
  }
}
