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
    const transitionDuration = lifeConfig.transitions.evolution

    this.update = null

    this.updateSeconds = () => {
      if (this.tick === startedAt + transitionDuration) {
        this.life.evolve()
      }
    }

    this.dispose = () => {
      idle1.dispose()
      this.screen.setFlicker(false)
    }
  },

  egg() {
    this.dispose && this.dispose()

    const hatching = this.sprites.get('egg').at(0)
    hatching.spawn()

    Soundboard.instance.play('hatching')
    this.life.dispatchEvent({ type: 'evolve-out' })

    const startedAt = this.tick
    const transitionDuration = lifeConfig.transitions.hatching

    this.update = null

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
}
