import Misc from '@life/misc'
import Random from '@utils/random'

export default {
  default() {
    this.dispose && this.dispose()

    this.life.disposeMess()

    const sit1 = this.sprites.get('sit').at(0)
    sit1.spawn()
    sit1.mesh.rotation.y = Math.PI

    const toiletWidth = ['babies', 'children'].includes(this.stage) ? 0.6 : 0.4
    const toiletHeight = ['babies', 'children'].includes(this.stage) ? 0.8 : 1.2
    sit1.mesh.position.x = toiletWidth
    sit1.mesh.position.y = toiletHeight

    const sit2 = this.sprites.get('sit').at(1)
    if (sit2) {
      sit2.spawn()
      sit2.mesh.visible = false
      sit2.mesh.rotation.y = Math.PI
      sit2.mesh.position.x = toiletWidth
      sit2.mesh.position.y = toiletHeight
    }

    const toilet = Misc.instance.getToilet(this.stage)
    toilet.spawn()

    const startedAt = this.tick

    this.update = null

    this.updateSeconds = () => {
      if (this.tick === startedAt + 10) {
        this.happy()
        return
      }

      const direction = this.tick % 2 ? 1 : -1
      sit1.mesh.position.x += this.screen.unit * direction
      if (sit2) {
        sit2.mesh.position.copy(sit1.mesh.position)
        sit1.mesh.visible = Random.boolean()
        sit2.mesh.visible = !sit1.mesh.visible
      }
    }

    this.dispose = () => {
      sit1.dispose()
      sit2?.dispose()
      toilet.dispose()
    }
  },
}
