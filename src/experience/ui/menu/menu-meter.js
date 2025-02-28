import { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'
import Menu from './menu'

export default class MenuMeter extends Menu {
  constructor() {
    super()

    this.texture = this.resources.items.menuMeter1
    this.hasOptions = true

    this.setGeometry()
    this.setMaterial()
    this.setMesh()

    this.meterGeometry = new PlaneGeometry()
    this.setMetersEmpty()
    this.setMetersFull()

    this.meterType = 'hungry'
  }

  setMetersEmpty() {
    const material = new MeshBasicMaterial({
      map: this.resources.items.meterEmpty,
      transparent: true,
    })

    this.metersEmpty = Array(4)
      .fill(true)
      .map((_, i) => new Mesh(this.meterGeometry, material))

    this.setMetersPosition(this.metersEmpty)
  }

  setMetersFull() {
    const material = new MeshBasicMaterial({
      map: this.resources.items.meterFull,
      transparent: true,
    })

    this.metersFull = Array(4)
      .fill(true)
      .map((_, i) => new Mesh(this.meterGeometry, material))

    this.setMetersPosition(this.metersFull)
  }

  setMetersPosition(meters) {
    meters.forEach((m, i) => {
      m.visible = true
      m.position.x = -1.7 + i * 1.1
      m.position.y = 1.2
      m.position.z = this.screen.center.z
      m.visible = false

      this.scene.add(m)
    })
  }

  updateMeters() {
    this.metersEmpty.forEach(m => (m.visible = true))
    this.metersFull.forEach((m, i) => (m.visible = i + 1 <= this.life.stats[this.meterType]))
  }

  show() {
    this.meterType = 'hungry'
    this.material.map = this.resources.items.menuMeter1
    this.material.needsUpdate = true

    this.updateMeters()

    super.show()
    Menu.arrow.visible = false
  }

  hide() {
    super.hide()

    this.metersEmpty.forEach(m => (m.visible = false))
    this.metersFull.forEach(m => (m.visible = false))
  }

  cycle() {
    this.meterType = this.meterType === 'hungry' ? 'happy' : 'hungry'
    this.material.map =
      this.meterType === 'hungry'
        ? this.resources.items.menuMeter1
        : this.resources.items.menuMeter2
    this.material.needsUpdate = true
    this.updateMeters()
  }

  action() {
    this.cycle()
    return this
  }
}
