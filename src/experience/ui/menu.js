import html2canvas from 'html2canvas-pro'
import { CanvasTexture, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'
import Experience from '../experience'

export default class Menu {
  constructor(element) {
    this.experience = Experience.instance
    this.life = this.experience.life
    this.scene = this.experience.screen.scene

    this.element = element

    this.setGeometry()
    this.setMaterial()
    this.setMesh()
  }

  setGeometry() {
    this.geometry = new PlaneGeometry()
  }

  setMaterial() {
    this.material = new MeshBasicMaterial({ transparent: true })
  }

  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material)
    this.mesh.position.z = -2
    this.mesh.position.y = 1.43
    this.mesh.visible = false

    this.scene.add(this.mesh)
    this.refreshMenu()
  }

  async refreshMenu() {
    const canvas = await this.getCanvas(this.element)
    const texture = new CanvasTexture(canvas)

    this.material.map = texture
    this.material.needsUpdate = true
  }

  show() {
    this.visible = true
    this.mesh.visible = true

    // TODO: improve
    this.life.group.visible = false
    this.life.pause = true
  }

  hide() {
    this.visible = false
    this.mesh.visible = false

    // TODO: improve
    this.life.group.visible = true
    this.life.pause = false

    this.reset()
    this.refreshMenu()
  }

  cycle() {}
  reset() {}
  action() {}

  getCanvas(element) {
    return html2canvas(element, {
      ignoreElements: el =>
        el.nodeName !== 'BODY' &&
        el.nodeName !== 'HEAD' &&
        el.id !== 'html2canvas' &&
        !el.closest('#html2canvas') &&
        !el.href?.includes('.css'),
      backgroundColor: null,
    })
  }
}
