import Experience from '@experience'
import Misc from '@life/misc'

export default class Sickness {
  get tick() {
    return this.experience.life.tick
  }

  get pet() {
    return this.experience.life.pet
  }

  constructor() {
    this.experience = Experience.instance
    this.screen = this.experience.screen

    this.sprite = Misc.instance.getSickness(this.pet.stage)

    this.sprite.spawn()
    this.sprite.mesh.visible = false
    this.sprite.mesh.rotation.y = Math.PI * (this.tick % 2)
    this.sprite.mesh.position.set(1.8, 1.6)
  }

  hide() {
    this.sprite.mesh.visible = false
  }

  show() {
    this.sprite.mesh.visible = true
  }

  updateSeconds() {
    this.sprite.mesh.rotation.y = Math.PI * (this.tick % 2)
  }

  dispose() {
    this.sprite.dispose()
  }
}
