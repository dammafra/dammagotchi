import { Soundboard } from '@ui/soundboard'

export default {
  default() {
    this.dispose && this.dispose()

    const idle1 = this.sprites.get('idle').at(0)
    idle1.spawn()

    Soundboard.instance.play('evolution')

    this.updateSeconds = null

    this.dispose = () => {
      idle1.dispose()
    }
  },

  egg() {
    this.dispose && this.dispose()

    const hatching = this.sprites.get('egg').at(0)
    hatching.spawn()
    hatching.mesh.visible = true

    Soundboard.instance.play('hatching')

    this.updateSeconds = () => {
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

    const startedAt = this.age

    Soundboard.instance.play('death')

    this.updateSeconds = () => {
      if (this.age > startedAt + 3) {
        eyesClosed.mesh.position.y += this.screen.unit * 4
      }
    }

    this.dispose = () => {
      eyesClosed.dispose()
    }
  },
}
