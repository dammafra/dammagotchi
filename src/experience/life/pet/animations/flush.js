import Misc from '@life/misc'

export default {
  default() {
    this.dispose && this.dispose()

    const idle = this.sprites.get('idle').at(0)
    idle.spawn()
    if (this.stats.mess > 1) {
      idle.mesh.position.x = -1
    }

    const flush = Misc.instance.getFlush()
    flush.spawn()
    flush.mesh.scale.y = 0.9
    flush.mesh.position.x = this.screen.bounds.xMax + (flush.width * this.screen.unit) / 2

    let sickness
    if (this.stats.sick) {
      sickness = Misc.instance.getSickness(this.stage)
      sickness.spawn()
      sickness.mesh.position.set(1.8, 1.6)
      sickness.mesh.rotation.y = Math.PI * (this.tick % 2)
    }

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
      idle.dispose()
      flush.dispose()
      sickness?.dispose()
      this.life.disposeMess()
      this.life.group.position.x = 0
    }
  },
}
