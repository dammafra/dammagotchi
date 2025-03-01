import Misc from '@life/misc'
import { Soundboard } from '@ui/soundboard'
import { dispose } from '@utils/dispose'

export default function () {
  this.dipose && this.dispose()

  const [ready, go] = Misc.instance.getGame()
  this.game.group.add(ready.mesh)
  this.game.group.add(go.mesh)
  ready.mesh.visible = true
  go.mesh.visible = false

  Soundboard.instance.play('game-start')

  const startedAt = this.tick

  this.updateSeconds = () => {
    if (this.tick === startedAt + 5) {
      ready.mesh.visible = false
      go.mesh.visible = true
    }

    if (this.tick === startedAt + 7) {
      this.run()
    }
  }

  this.dispose = () => {
    dispose(ready.mesh)
    dispose(go.mesh)
    this.game.group.remove(ready.mesh, go.mesh)
  }
}
