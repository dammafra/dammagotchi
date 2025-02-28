import { Soundboard } from '@ui/soundboard'

export default {
  default() {
    this.dispose && this.dispose()

    const happy = this.sprites.get('happy').at(0)
    happy.spawn()

    Soundboard.instance.play('game-start')

    const startedAt = this.tick

    this.update = null

    this.updateSeconds = () => {
      if (this.tick === startedAt + 10) {
        this.idle()
        return
      }

      const toggle = Boolean((this.tick - startedAt) % 2)
    }

    this.dispose = () => {
      happy.dispose()
    }
  },
}
