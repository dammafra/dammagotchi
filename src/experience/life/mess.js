import Experience from '@experience'
import Misc from '@life/misc'

export default class Mess {
  get tick() {
    return this.experience.life.tick
  }

  get pet() {
    return this.experience.life.pet
  }

  constructor(index) {
    this.experience = Experience.instance
    this.screen = this.experience.screen

    this.sprite = Misc.instance.getMess(this.pet.stage)

    this.sprite.spawn()
    this.sprite.mesh.visible = false
    this.sprite.mesh.rotation.y = Math.PI * (this.tick % 2)
    this.sprite.mesh.position.x = index % 2 ? 0.8 : 1.8
    this.sprite.mesh.position.y = index < 2 ? this.screen.center.y : 0.8
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
