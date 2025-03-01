import { dispose } from '@utils/dispose'

export default function () {
  this.dispose && this.dispose()

  const happy = this.life.pet.sprites.get('happy').at(0)
  const endPositionX = -(happy.mesh.position.x - this.screen.bounds.xMin - (happy.width * this.screen.unit) / 2) //prettier-ignore

  this.update = () => {
    if (this.game.group.position.x <= endPositionX) {
      this.run()
      return
    }

    this.game.group.position.x -= this.screen.unit * this.time.delta * 30 * this.time.speedSetting
  }

  this.updateSeconds = null

  this.dispose = () => {
    dispose(happy.mesh)
    this.game.group.remove(happy.mesh)
    this.game.group.position.x = 0
  }
}
