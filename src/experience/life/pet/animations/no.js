export default {
  default() {
    this.dispose && this.dispose()

    const no = this.sprites.get('no').at(0)
    no.spawn()

    const startedAt = this.age

    this.updateSeconds = () => {
      if (this.age === startedAt + 1) {
        no.mesh.rotation.y += Math.PI
      }

      if (this.age === startedAt + 2) {
        no.mesh.rotation.y += Math.PI
      }

      if (this.age === startedAt + 3) {
        no.mesh.rotation.y += Math.PI
      }

      if (this.age === startedAt + 4) {
        no.mesh.rotation.y += Math.PI
      }

      if (this.age === startedAt + 5) {
        this.idle()
      }
    }

    this.dispose = () => {
      no.dispose()
    }
  },
}
