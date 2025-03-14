import lifeConfig from '@config/life'

export default {
  default() {
    this.dispose && this.dispose()

    const idle = this.sprites.get('idle').at(0)
    idle.spawn()

    this.screen.setFlicker(true)

    const startedAt = this.tick
    const transitionDuration = lifeConfig.transitions.evolution

    this.update = null

    this.updateSeconds = () => {
      if (this.tick === startedAt + transitionDuration) {
        this.idle()
      }
    }

    this.dispose = () => {
      idle.dispose()
      this.screen.setFlicker(false)
    }
  },

  baby() {
    this.dispose && this.dispose()

    const hatching = this.sprites.get('hatching').at(0)
    hatching.spawn()

    const startedAt = this.tick
    const transitionDuration = lifeConfig.transitions.evolution

    this.update = null

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
