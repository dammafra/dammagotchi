import lifeConfig from '@config/life'
import { Soundboard } from '@ui/soundboard'

export default {
  default() {
    this.dispose && this.dispose()

    const idle1 = this.sprites.get('idle').at(0)
    idle1.spawn()

    Soundboard.instance.play('evolution')
    this.screen.setFlicker(true)
    this.life.dispatchEvent({ type: 'evolve-out' })

    const startedAt = this.tick
    const transitionDuration = lifeConfig.transitions[this.stage].out

    this.updateSeconds = () => {
      if (this.tick === startedAt + transitionDuration) {
        this.life.evolve()
      }
    }

    this.dispose = () => {
      idle1.dispose()
    }
  },

  egg() {
    this.dispose && this.dispose()

    const hatching = this.sprites.get('egg').at(0)
    hatching.spawn()

    Soundboard.instance.play('hatching')
    this.life.dispatchEvent({ type: 'evolve-out' })

    const startedAt = this.tick
    const transitionDuration = lifeConfig.transitions[this.stage].out

    this.updateSeconds = () => {
      if (this.tick === startedAt + transitionDuration) {
        this.life.evolve()
        return
      }

      hatching.mesh.position.x +=
        hatching.mesh.position.x < 0 ? this.screen.unit : -this.screen.unit
    }

    this.dispose = () => {
      hatching.dispose()
    }
  },

  senior() {
    this.dispose && this.dispose()

    const eyesClosed = this.sprites.get('eyes-closed').at(0)
    eyesClosed.spawn()

    Soundboard.instance.play('death')
    this.life.disposeMess()
    this.life.dispatchEvent({ type: 'evolve-out' })

    const startedAt = this.tick
    const transitionDuration = lifeConfig.transitions[this.stage].out

    this.updateSeconds = () => {
      if (this.tick === startedAt + transitionDuration) {
        this.life.evolve()
        return
      }

      if (this.tick > startedAt + 3) {
        eyesClosed.mesh.position.y += this.screen.unit * 4
      }
    }

    this.dispose = () => {
      eyesClosed.dispose()
    }
  },
}
