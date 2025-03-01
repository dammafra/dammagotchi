import Experience from '@experience'
import { DoubleSide, Mesh, MeshBasicMaterial, NearestFilter, PlaneGeometry } from 'three'
import { Soundboard } from './soundboard'

export default class Icons {
  static FEED = 0
  static LIGHT = 1
  static PLAY = 2
  static MEDICINE = 3
  static DUCK = 4
  static METER = 5
  static DISCIPLINE = 6
  static ATTENTION = 7

  constructor() {
    this.experience = Experience.instance
    this.screen = this.experience.screen
    this.scene = this.screen.scene
    this.resources = this.experience.resources

    this.selected = Icons.ATTENTION
    this.baseOpacity = 0.3

    this.notified = new Set()
  }

  ready() {
    this.setMeshes()
  }

  setMeshes() {
    const geometry = new PlaneGeometry()

    this.meshes = [
      'feed',
      'light',
      'play',
      'medicine',
      'duck',
      'meter',
      'discipline',
      'attention',
    ].map((icon, index) => {
      const texture = this.resources.items[icon]
      texture.minFilter = NearestFilter
      texture.magFilter = NearestFilter

      const material = new MeshBasicMaterial({
        transparent: true,
        map: texture,
        alphaMap: texture,
        side: DoubleSide,
        color: 'black',
        opacity: this.baseOpacity,
      })

      const mesh = new Mesh(geometry, material)
      mesh.scale.setScalar(0.7)
      mesh.position.copy(this.screen.center)
      mesh.position.x = -1.6 + (index % 4) * 1.1
      mesh.position.y = index < 4 ? 3.25 : -0.5

      this.scene.add(mesh)
      return mesh
    })
  }

  setSelected(selected) {
    this.selected = selected
    this.meshes.forEach((icon, index) => {
      if (index === Icons.ATTENTION) return
      icon.material.opacity = this.selected === index ? 1 : this.baseOpacity
    })
  }

  cycle() {
    this.setSelected((this.selected + 1) % 8)
  }

  notifyAttention = event => {
    if (this.notified.has(event.need)) return

    this.notified.add(event.need)
    this.meshes.at(Icons.ATTENTION).material.opacity = 1
    Soundboard.instance.play('attention')
  }

  resolveAttention = event => {
    if (event && event.need) {
      this.notified.delete(event.need)
    } else {
      this.notified.clear()
    }

    if (!this.notified.size) {
      this.meshes.at(Icons.ATTENTION).material.opacity = this.baseOpacity
    }
  }

  reset(resolveAttention) {
    this.setSelected(Icons.ATTENTION)
    if (resolveAttention) this.resolveAttention()
  }
}
