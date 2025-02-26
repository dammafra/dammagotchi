import Misc from '@life/misc'

export default {
  default() {
    this.dispose && this.dispose()

    this.canInteract = false

    const eyesClosed = this.sprites.get('eyes-closed').at(0)
    eyesClosed.spawn()

    const toiletWidth = ['babies', 'children'].includes(this.stage) ? 0.6 : 0.4
    const toiletHeight = ['babies', 'children'].includes(this.stage) ? 0.8 : 1.2
    eyesClosed.mesh.position.x = toiletWidth
    eyesClosed.mesh.position.y = toiletHeight

    const toilet = Misc.instance.getToilet(this.stage)
    toilet.spawn()

    const startedAt = this.tick

    this.update = null

    this.updateSeconds = () => {
      if (this.tick === startedAt + 10) {
        this.happy()
        this.isMessing = false
        return
      }

      const direction = (this.tick - startedAt) % 2 ? 1 : -1
      eyesClosed.mesh.position.x += this.screen.unit * direction
    }

    this.dispose = () => {
      eyesClosed.dispose()
      toilet.dispose()
      this.life.disposeMess()
    }
  },
}
