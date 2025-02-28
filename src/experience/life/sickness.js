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

    this.smallSprite = Misc.instance.getSickness('babies')
    this.bigSprite = Misc.instance.getSickness('adults')

    this.smallSprite.spawn()
    this.smallSprite.mesh.visible = false
    this.smallSprite.mesh.rotation.y = Math.PI * (this.tick % 2)
    this.smallSprite.mesh.position.set(1.8, 1.6)

    this.bigSprite.spawn()
    this.bigSprite.mesh.visible = false
    this.bigSprite.mesh.rotation.copy(this.smallSprite.mesh.rotation)
    this.bigSprite.mesh.position.copy(this.smallSprite.mesh.position)
  }

  hide() {
    this.smallSprite.mesh.visible = false
    this.bigSprite.mesh.visible = false
  }

  show() {
    this.smallSprite.mesh.visible = ['babies', 'children'].includes(this.pet.stage)
    this.bigSprite.mesh.visible = !this.smallSprite.mesh.visible
  }

  updateSeconds() {
    this.smallSprite.mesh.rotation.y = Math.PI * (this.tick % 2)
    this.bigSprite.mesh.rotation.copy(this.smallSprite.mesh.rotation)
  }

  dispose() {
    this.smallSprite.dispose()
    this.bigSprite.dispose()
  }
}
