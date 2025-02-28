export default {
  default() {
    this.dispose && this.dispose()

    this.canEvolve = true
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

    this.life.showMess()
    this.life.sickness.show()

    const startedAt = this.tick

    this.update = null

    this.updateSeconds = () => {
      // animation
      const toggle = Boolean((this.tick - startedAt) % 2)
      eyesClosed.mesh.visible = toggle
      sad.mesh.visible = !toggle

      // misc update
      this.life.mess.forEach(m => m.updateSeconds())
      this.life.sickness.updateSeconds()
    }

    this.dispose = () => {
      this.canEvolve = false
      this.canInteract = false

      eyesClosed.dispose()
      sad.dispose()

      this.life.hideMess()
      this.life.sickness.hide()
    }
  },
}
