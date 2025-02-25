import Misc from '@life/misc'

export default {
  default() {
    this.dispose && this.dispose()

    this.canInteract = true

    const eyesClosed = this.sprites.get('eyes-closed').at(0)
    eyesClosed.spawn()

    const effort1 = Misc.instance.get('effort').at(0)
    const effort2 = effort1.clone()
    effort1.spawn()
    effort2.spawn()
    effort1.mesh.position.set(-1.5, 0.5)
    effort2.mesh.position.set(1.5, 0.5)
    effort2.mesh.rotation.y = Math.PI

    const startedAt = this.tick

    this.updateSeconds = () => {
      if (this.tick < startedAt + 20) {
        const direction = this.tick % 2 ? -1 : 1
        eyesClosed.mesh.position.x += this.screen.unit * direction
        effort1.mesh.rotation.y += Math.PI * direction
        effort2.mesh.rotation.y += Math.PI * direction
        return
      }

      this.idle()
    }

    this.dispose = () => {
      this.canInteract = false

      eyesClosed.dispose()
      effort1.dispose()
      effort2.dispose()

      this.life.addMess()
      this.life.hideMess()
    }
  },
}
