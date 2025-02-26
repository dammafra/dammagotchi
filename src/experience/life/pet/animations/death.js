import lifeConfig from '@config/life'
import { Soundboard } from '@ui/soundboard'

export default {
  default() {
    this.dispose && this.dispose()

    const eyesClosed = this.sprites.get('eyes-closed').at(0)
    eyesClosed.spawn()

    Soundboard.instance.play('death')
    this.life.disposeMess()
    this.life.dispatchEvent({ type: 'evolve-out' })

    const startedAt = this.tick
    const transitionDuration = lifeConfig.transitions.death

    this.updateSeconds = () => {
      if (this.tick === startedAt + transitionDuration) {
        this.life.end()
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
