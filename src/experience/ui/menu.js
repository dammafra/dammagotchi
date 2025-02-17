import html2canvas from 'html2canvas-pro'
import { CanvasTexture, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'
import Experience from '../experience'
import Food from '../life/food'

export default class Menu {
  constructor() {
    this.experience = Experience.instance
    this.life = this.experience.life
    this.scene = this.experience.device.screen.scene

    this.feedMenu = document.getElementById('feed-menu')
    this.foodType = Food.MEAL
    this.visible = false

    this.setGeometry()
    this.setMenu()
  }

  setGeometry() {
    this.geometry = new PlaneGeometry()
  }

  setMenu() {
    this.material = new MeshBasicMaterial({ transparent: true })

    this.plane = new Mesh(this.geometry, this.material)
    this.plane.position.z = -2
    this.plane.position.y = 1.43
    this.plane.visible = false

    this.scene.add(this.plane)
    this.refreshMenu()
  }

  async refreshMenu() {
    const canvas = await this.getCanvas(this.feedMenu)
    const texture = new CanvasTexture(canvas)

    this.material.map = texture
    this.material.needsUpdate = true
  }

  show() {
    this.visible = true
    this.plane.visible = true
    this.experience.life.group.visible = false
    this.experience.life.pause = true
  }

  hide() {
    this.visible = false
    this.plane.visible = false
    this.experience.life.group.visible = true
    this.experience.life.pause = false
  }

  selectFoodType() {
    const arrows = this.feedMenu.getElementsByClassName('arrow')
    for (const arrow of arrows) {
      arrow.classList.toggle('invisible')
    }
    this.foodType = this.foodType === Food.SNACK ? Food.MEAL : Food.SNACK
    this.refreshMenu()
  }

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
