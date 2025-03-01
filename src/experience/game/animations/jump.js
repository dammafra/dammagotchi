import Misc from '@life/misc'
import { Soundboard } from '@ui/soundboard'
import { dispose } from '@utils/dispose'

export default function () {
  this.dispose && this.dispose()

  const [run1, run2] = this.life.pet.sprites.get('run')
  const happy = this.life.pet.sprites.get('happy').at(0)
  happy.mesh.position.copy(run1.mesh.position)
  happy.mesh.position.x += this.screen.unit * 3
  happy.mesh.position.y += this.screen.unit * 3
  this.game.group.add(happy.mesh)

  dispose(run1.mesh)
  dispose(run2.mesh)
  this.game.group.remove(run1.mesh, run2.mesh)

  const obstacle = Misc.instance.getGame().at(2)

  Soundboard.instance.play('happy')

  const startedAt = this.tick

  this.update = null

  this.updateSeconds = () => {
    if (happy.mesh.position.distanceTo(obstacle.mesh.position) < 0.67) {
      this.fell()
      return
    }

    if (this.tick >= startedAt + 6) {
      this.game.jumped = false
      this.game.score++
      this.game.refreshScoreTexture()
      if (this.game.score === 10) this.game.end()
      else this.shift()
      return
    }

    const direction = this.tick < startedAt + 3 ? 1 : -1
    happy.mesh.position.x += this.screen.unit * 3
    happy.mesh.position.y += this.screen.unit * 3 * direction
    obstacle.mesh.position.x -= this.screen.unit * 2
  }
}
