export default {
  default() {
    this.dispose && this.dispose()

    const idle1 = this.sprites.get('idle').at(0)
    idle1.spawn()

    this.updateSeconds = null

    this.dispose = () => {
      idle1.dispose()
    }
  },

  baby() {
    this.dispose && this.dispose()

    const hatching = this.sprites.get('hatching').at(0)
    hatching.spawn()

    this.updateSeconds = null

    this.dispose = () => {
      hatching.dispose()
    }
  },
}
