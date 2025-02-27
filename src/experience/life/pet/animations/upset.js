import Misc from '@life/misc'

export default {
  default() {
    this.dispose && this.dispose()

    const eyesClosed = this.sprites.get('eyes-closed').at(0)
    const upset = this.sprites.get('upset').at(0)
    eyesClosed.spawn()
    upset.spawn()
    upset.mesh.visible = false

    const [cloud1, cloud2] = Misc.instance.getUpset()
    cloud1.spawn()
    cloud2.spawn()
    cloud2.mesh.visible = false
    cloud1.mesh.position.set(1.3, 1.3)
    cloud1.mesh.scale.setScalar(0.5)
    cloud2.mesh.position.copy(cloud1.mesh.position)
    cloud2.mesh.scale.copy(cloud1.mesh.scale)

    const startedAt = this.tick

    this.update = null

    this.updateSeconds = () => {
      if (this.tick === startedAt + 6) {
        this.idle()
        return
      }

      const toggle = Boolean((this.tick - startedAt) % 2)
      upset.mesh.visible = toggle
      cloud2.mesh.visible = toggle
      cloud1.mesh.visible = !toggle
      eyesClosed.mesh.visible = !toggle
    }

    this.dispose = () => {
      eyesClosed.dispose()
      upset.dispose()
      cloud1.dispose()
      cloud2.dispose()
    }
  },
}
