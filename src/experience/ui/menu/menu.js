import Experience from '@experience'
import { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'

export default class Menu {
  /** @type {Mesh} */
  static arrow = null
  static arrowUpY = 2.4
  static arrowDownY = 1

  constructor() {
    this.experience = Experience.instance
    this.resources = this.experience.resources
    this.life = this.experience.life
    this.screen = this.experience.screen
    this.scene = this.screen.scene

    this.texture = null
    this.hasOptions = false
    this.selectedOption = 0

    if (!Menu.arrow) this.setArrow()
  }

  setArrow() {
    Menu.arrow = new Mesh(
      new PlaneGeometry(),
      new MeshBasicMaterial({ map: this.resources.items.arrow, transparent: true }),
    )
    Menu.arrow.scale.setScalar(0.8)
    Menu.arrow.position.x = this.screen.bounds.xMin + 0.3
    Menu.arrow.position.y = Menu.arrowUpY
    Menu.arrow.position.z = this.screen.center.z
    Menu.arrow.visible = false

    this.scene.add(Menu.arrow)
  }

  setGeometry() {
    this.geometry = new PlaneGeometry()
  }

  setMaterial() {
    this.material = new MeshBasicMaterial({ map: this.texture, transparent: true })
  }

  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material)
    this.mesh.position.z = -2
    this.mesh.position.y = 1.43
    this.mesh.visible = false

    this.scene.add(this.mesh)
  }

  show() {
    this.visible = true
    this.mesh.visible = true
    Menu.arrow.visible = this.hasOptions

    this.life.hide()

    this.previouslyBlank = this.screen.isBlank
    this.screen.turnOn()
  }

  hide() {
    this.visible = false
    this.mesh.visible = false
    Menu.arrow.visible = false

    this.life.show()
    this.previouslyBlank && this.screen.turnOff()

    this.reset()
  }

  cycle() {
    Menu.arrow.position.y =
      Menu.arrow.position.y === Menu.arrowUpY ? Menu.arrowDownY : Menu.arrowUpY
  }

  reset() {}

  /**
   * @return `this` to keep open after action; use `this.hide()` and return `undefined` otherwise
   */
  action() {}
}
