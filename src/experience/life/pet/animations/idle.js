import { Soundboard } from '@ui/soundboard'
import Random from '@utils/random'

export default {
  default() {
    this.dispose && this.dispose()

    this.canInteract = true

    const idle1 = this.sprites.get('idle').at(0)
    idle1.spawn()
    if (this.stats.mess > 1) {
      idle1.mesh.position.x = -1
    }

    const idle2 = this.sprites.get('idle').at(1)
    idle2.spawn()
    idle2.mesh.visible = false

    this.life.showMess()

    this.update = null

    this.updateSeconds = () => {
      if (this.stats.sick) this.sick()

      // stats
      this.life.checkNeeds()

      // animation
      idle1.mesh.visible = Random.boolean()

      const directionX = Random.oneOf(+this.screen.unit, -this.screen.unit)

      const position = idle1.mesh.position.clone()
      position.x += directionX

      if (this.screen.contains(idle1, position) && !this.life.collideMess(idle1, position)) {
        idle1.mesh.position.copy(position)
        idle1.mesh.rotation.y = directionX > 0 ? Math.PI : 0
      }

      idle2.copy(idle1)
      idle2.mesh.visible = !idle1.mesh.visible

      // mess update
      this.life.mess.forEach(m => m.updateSeconds())
    }

    this.dispose = () => {
      this.canInteract = false

      idle1.dispose()
      idle2.dispose()

      this.life.hideMess()
    }
  },

  egg() {
    this.dispose && this.dispose()

    const normal = this.sprites.get('egg').at(0)
    normal.spawn()

    const squeezed = this.sprites.get('egg').at(1)
    squeezed.spawn()
    squeezed.mesh.visible = false

    Soundboard.instance.play('happy')

    this.update = null

    this.updateSeconds = () => {
      normal.mesh.visible = !normal.mesh.visible
      squeezed.mesh.visible = !squeezed.mesh.visible
    }

    this.dispose = () => {
      normal.dispose()
      squeezed.dispose()
    }
  },

  death() {
    this.dispose && this.dispose()

    const death = this.sprites.get('death').at(0)
    death.spawn()

    const startPositionY = 0.8
    death.mesh.position.y = startPositionY

    this.update = null

    this.updateSeconds = () => {
      death.mesh.position.y +=
        death.mesh.position.y > startPositionY ? -this.screen.unit : +this.screen.unit
    }

    this.dispose = () => {
      death.dispose()
    }
  },
}
