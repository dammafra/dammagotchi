import Misc from '@life/misc'

export default {
  default() {
    this.dispose && this.dispose()

    this.canInteract = true

    const eyesClosed = this.sprites.get('eyes-closed').at(0)
    const sad = this.sprites.get('sad').at(0)
    eyesClosed.spawn()
    sad.spawn()
    sad.mesh.visible = false
    if (this.stats.mess > 1) {
      eyesClosed.mesh.position.x = -1
      sad.mesh.position.copy(eyesClosed.mesh.position)
    }

    const sickness = Misc.instance.getSickness(this.stage)
    sickness.spawn()
    sickness.mesh.position.set(1.8, 1.6)
    sickness.mesh.rotation.y = Math.PI * (this.tick % 2)

    this.life.showMess()

    const startedAt = this.tick

    this.update = null

    this.updateSeconds = () => {
      // stats
      this.life.checkNeeds()

      // animation
      const toggle = Boolean((this.tick - startedAt) % 2)
      eyesClosed.mesh.visible = toggle
      sad.mesh.visible = !toggle
      sickness.mesh.rotation.y = Math.PI * (this.tick % 2)

      // mess update
      this.life.mess.forEach(m => m.updateSeconds())
    }

    this.dispose = () => {
      this.canInteract = false

      eyesClosed.dispose()
      sad.dispose()
      sickness.dispose()

      this.life.hideMess()
    }
  },
}
