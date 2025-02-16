import {
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  NearestFilter,
  PlaneGeometry,
  SRGBColorSpace,
} from 'three'
import Experience from '../experience'

export default class UI {
  constructor() {
    this.experience = Experience.instance
    this.screen = this.experience.device.screen
    this.scene = this.screen.scene
    this.resources = this.experience.resources

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

  selectIcon(index) {
    this.icons.forEach((icon, i) => {
      icon.material.opacity = i === index ? 1 : this.baseOpacity
    })
  }
}
