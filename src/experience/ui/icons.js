import {
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  NearestFilter,
  PlaneGeometry,
  SRGBColorSpace,
} from 'three'
import Experience from '../experience'

export const Icon = Object.freeze({
  METER: 0,
  FEED: 1,
  DUCK: 2,
  PLAY: 3,
  DISCIPLINE: 4,
  MEDICINE: 5,
  LIGHT: 6,
  ATTENTION: 7,
})

export default class Icons {
  constructor() {
    this.experience = Experience.instance
    this.screen = this.experience.device.screen
    this.scene = this.screen.scene
    this.resources = this.experience.resources

    this.selected = Icon.ATTENTION
    this.baseOpacity = 0.3

    this.setIcons()
  }

  setIcons() {
    const geometry = new PlaneGeometry()

    this.icons = [
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

  cycle() {
    this.selected = ++this.selected % 8
    this.icons.forEach((icon, index) => {
      icon.material.opacity = this.baseOpacity
      if (this.selected === index && this.selected != Icon.ATTENTION) {
        icon.material.opacity = 1
      }
    })
  }

  notifyAttention() {
    this.icons.at(Icon.ATTENTION).material.opacity = 1
  }

  resolveAttention() {
    this.icons.at(Icon.ATTENTION).material.opacity = this.baseOpacity
  }

  reset = () => {
    this.icons.at(this.selected).material.opacity = this.baseOpacity
    this.selected = Icon.ATTENTION
  }
}
