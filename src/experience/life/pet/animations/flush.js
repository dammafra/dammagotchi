import Misc from '@life/misc'

export default {
  default() {
    this.dispose && this.dispose()

    const idle1 = this.sprites.get('idle').at(0)
    idle1.spawn()
    if (this.stats.mess > 1) {
      idle1.mesh.position.x = -1
    }

    const flush = Misc.instance.getFlush()
    flush.spawn()
    flush.mesh.scale.y = 0.95
    flush.mesh.position.x = this.screen.bounds.xMax + (flush.width * this.screen.unit) / 2

    this.life.showMess()

    const endPositionX = -(this.screen.bounds.xMax - this.screen.bounds.xMin) - flush.width * this.screen.unit - 1 //prettier-ignore

    this.update = () => {
      if (this.life.group.position.x <= endPositionX) {
        this.stats.mess ? this.happy() : this.idle()
        return
      }

      this.life.group.position.x -= this.screen.unit * this.time.delta * 30 * this.time.speedSetting
    }

    this.updateSeconds = null

    this.dispose = () => {
      idle1.dispose()
      flush.dispose()
      this.life.disposeMess()
      this.life.group.position.x = 0
    }
  },
}
