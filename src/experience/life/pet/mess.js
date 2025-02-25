import Experience from '@experience'
import Misc from '@life/misc'

export default class Mess {
  get tick() {
    return this.experience.life.scheduler.tick
  }

  get pet() {
    return this.experience.life.pet
  }

  constructor(index) {
    this.experience = Experience.instance
    this.screen = this.experience.screen

    this.sprite = Misc.instance
      .get('mess')
      .at(['babies', 'children'].includes(this.pet.stage) ? 0 : 1)
      .clone()

    this.sprite.spawn()
    this.sprite.mesh.rotation.y = Math.PI * (this.tick % 2)
    this.sprite.mesh.position.x = index % 2 ? 0.8 : 1.8
    this.sprite.mesh.position.y = index < 2 ? this.screen.center.y : index < 4 ? 0.8 : 2 * 0.8
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
