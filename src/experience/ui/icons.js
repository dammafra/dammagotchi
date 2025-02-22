import Experience from '@experience'
import {
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  NearestFilter,
  PlaneGeometry,
  SRGBColorSpace,
} from 'three'
import { Soundboard } from './soundboard'

export default class Icons {
  static METER = 0
  static FEED = 1
  static DUCK = 2
  static PLAY = 3
  static DISCIPLINE = 4
  static MEDICINE = 5
  static LIGHT = 6
  static ATTENTION = 7

  constructor() {
    this.experience = Experience.instance
    this.screen = this.experience.screen
    this.scene = this.screen.scene
    this.resources = this.experience.resources

    this.selected = Icons.ATTENTION
    this.baseOpacity = 0.3
  }

  ready() {
    this.setMeshes()
  }

  setMeshes() {
    const geometry = new PlaneGeometry()

    this.meshes = [
      'meter',
      'feed',
      'duck',
      'play',
      'discipline',
      'medicine',
      'light',
      'attention',
    ].map((icon, index) => {
      const texture = this.resources.items[icon]
      texture.colorSpace = SRGBColorSpace
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
      icon.material.opacity = this.baseOpacity
      if (this.selected === index && this.selected != Icons.ATTENTION) {
        Soundboard.instance.play('button')
        icon.material.opacity = 1
      }
    })
  }

  cycle() {
    this.setSelected((this.selected + 1) % 8)
  }

  notifyAttention() {
    Soundboard.instance.play('attention')
    this.meshes.at(Icons.ATTENTION).material.opacity = 1
  }

  resolveAttention() {
    this.meshes.at(Icons.ATTENTION).material.opacity = this.baseOpacity
  }

  reset() {
    this.setSelected(Icons.ATTENTION)
  }
}
