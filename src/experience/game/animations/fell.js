import Misc from '@life/misc'
import { dispose } from '@utils/dispose'

export default function () {
  this.dispose && this.dispose()

  const [run1, run2, fell] = this.life.pet.sprites.get('run')
  const happy = this.life.pet.sprites.get('happy').at(0)
  fell.mesh.position.copy(this.game.jumped ? happy.mesh.position : run1.mesh.position)
  fell.mesh.position.x += this.screen.unit * 4
  fell.mesh.position.y = this.screen.center.y
  fell.mesh.rotation.y = Math.PI
  this.game.group.add(fell.mesh)

  dispose(run1.mesh)
  dispose(run2.mesh)
  dispose(happy.mesh)
  this.game.group.remove(run1.mesh, run2.mesh, happy.mesh)

  const obstacle = Misc.instance.getGame().at(2)

  const startedAt = this.tick

  this.update = null

  this.updateSeconds = () => {
    if (this.tick >= startedAt + 3) {
      this.game.end()
      return
    }
    fell.mesh.position.x += this.screen.unit * 2
    obstacle.mesh.position.x -= this.screen.unit * 2
  }

  this.dispose = () => {
    dispose(fell.mesh)
    dispose(obstacle.mesh)
    this.game.group.remove(fell.mesh, obstacle.mesh)
  }
}
