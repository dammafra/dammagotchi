import lifeConfig from '@config/life'

export default {
  default() {
    this.dispose && this.dispose()

    const idle1 = this.sprites.get('idle').at(0)
    idle1.spawn()

    this.screen.setFlicker(true)

    const startedAt = this.tick
    const transitionDuration = lifeConfig.transitions.evolution

    this.updateSeconds = () => {
      if (this.tick === startedAt + transitionDuration) {
        this.idle()
      }
    }

    this.dispose = () => {
      idle1.dispose()
      this.screen.setFlicker(false)
    }
  },

  baby() {
    this.dispose && this.dispose()

    const hatching = this.sprites.get('hatching').at(0)
    hatching.spawn()

    const startedAt = this.tick
    const transitionDuration = lifeConfig.transitions.evolution

    this.updateSeconds = () => {
      if (this.tick === startedAt + transitionDuration) {
        this.idle()
      }
    }

    this.dispose = () => {
      hatching.dispose()
    }
  },
}
