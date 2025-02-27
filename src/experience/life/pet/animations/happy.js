import Misc from '@life/misc'
import { Soundboard } from '@ui/soundboard'

export default {
  default() {
    this.dispose && this.dispose()

    const idle = this.sprites.get('idle').at(0)
    const happy = this.sprites.get('happy').at(0)
    idle.spawn()
    happy.spawn()
    happy.mesh.visible = false
    happy.mesh.position.y = 1

    const sun = Misc.instance.getHappy()
    sun.spawn()
    sun.mesh.visible = false
    sun.mesh.position.set(1.5, 1.5)
    sun.mesh.scale.setScalar(0.5)

    const startedAt = this.tick

    this.update = null

    this.updateSeconds = () => {
      if (this.tick === startedAt + 6) {
        this.idle()
        return
      }

      const toggle = Boolean((this.tick - startedAt) % 2)
      happy.mesh.visible = toggle
      sun.mesh.visible = toggle
      toggle && Soundboard.instance.play('happy')
      idle.mesh.visible = !toggle
    }

    this.dispose = () => {
      idle.dispose()
      happy.dispose()
      sun.dispose()
    }
  },
}
