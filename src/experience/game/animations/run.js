import Misc from '@life/misc'
import Random from '@utils/random'

export default function () {
  this.dispose && this.dispose()

  this.game.running = true

  const [run1, run2] = this.life.pet.sprites.get('run')
  run1.mesh.visible = true
  run1.mesh.rotation.y = Math.PI
  run1.mesh.position.x = this.screen.bounds.xMin + (run1.width * this.screen.unit) / 2
  run2.mesh.visible = false
  run2.mesh.rotation.copy(run1.mesh.rotation)
  run2.mesh.position.copy(run1.mesh.position)
  this.game.group.add(run1.mesh, run2.mesh)

  const obstacle = Misc.instance.getGame().at(2)
  obstacle.mesh.position.x = this.screen.bounds.xMax - Random.number(0.6, 1.5)
  this.game.group.add(obstacle.mesh)

  this.game.scoreMesh.visible = true

  const startedAt = this.tick

  this.update = null

  this.updateSeconds = () => {
    if (this.game.jumped) {
      this.jump()
      return
    }

    if (run1.mesh.position.distanceTo(obstacle.mesh.position) < 0.4) {
      this.fell()
      return
    }

    const toggle = Boolean((this.tick - startedAt) % 2)
    run1.mesh.visible = !toggle
    run2.mesh.visible = toggle

    run1.mesh.position.x += this.screen.unit * this.game.speed
    run2.mesh.position.copy(run1.mesh.position)
    obstacle.mesh.position.x -= this.screen.unit * this.game.speed
  }

  this.dispose = () => {
    this.game.running = false
  }
}
