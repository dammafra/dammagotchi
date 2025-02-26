import lifeConfig from '@config/life'

export default {
  default() {
    this.dispose && this.dispose()

    const idle1 = this.sprites.get('idle').at(0)
    idle1.spawn()

    const startedAt = this.tick
    const transitionDuration = lifeConfig.transitions[this.stage].in

    this.updateSeconds = () => {
      if (this.tick === startedAt + transitionDuration) {
        this.idle()
        this.screen.setFlicker(false)
      }
    }

    this.dispose = () => {
      idle1.dispose()
    }
  },

  baby() {
    this.dispose && this.dispose()

    const hatching = this.sprites.get('hatching').at(0)
    hatching.spawn()

    const startedAt = this.tick
    const transitionDuration = lifeConfig.transitions[this.stage].in

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
