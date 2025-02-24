import Experience from '@experience'
import { getCanvasFrom } from '@utils/canvas'
import { CanvasTexture, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'

export default class Menu {
  constructor(element) {
    this.experience = Experience.instance
    this.life = this.experience.life
    this.screen = this.experience.screen
    this.scene = this.screen.scene

    this.element = element
    this.hasOptions = false

    if (this.element) {
      this.setGeometry()
      this.setMaterial()
      this.setMesh()

      this.debug = this.element.classList.contains('debug')
      if (this.debug) {
        this.show()
        this.life.pause = true
        this.life.pet.canInteract = true
      }
    }
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
    const canvas = await getCanvasFrom(this.element)
    const texture = new CanvasTexture(canvas)

    this.material.map = texture
    this.material.needsUpdate = true
  }

  show() {
    this.visible = true
    this.mesh.visible = true

    this.life.hide()

    this.previouslyBlank = this.screen.isBlank
    this.screen.turnOn()
  }

  hide() {
    this.visible = false
    this.mesh.visible = false

    this.life.show()
    this.previouslyBlank && this.screen.turnOff()

    this.reset()
    this.refreshMenu()
  }

  cycle() {}
  reset() {}
  action() {}
}
