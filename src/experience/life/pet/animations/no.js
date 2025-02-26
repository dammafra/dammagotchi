export default {
  default() {
    this.dispose && this.dispose()

    const no = this.sprites.get('no').at(0)
    no.spawn()

    const startedAt = this.tick

    this.update = null

    this.updateSeconds = () => {
      if (this.tick === startedAt + 1) {
        no.mesh.rotation.y += Math.PI
      }

      if (this.tick === startedAt + 2) {
        no.mesh.rotation.y += Math.PI
      }

      if (this.tick === startedAt + 3) {
        no.mesh.rotation.y += Math.PI
      }

      if (this.tick === startedAt + 4) {
        no.mesh.rotation.y += Math.PI
      }

      if (this.tick === startedAt + 5) {
        this.idle()
      }
    }

    this.dispose = () => {
      no.dispose()
    }
  },
}
