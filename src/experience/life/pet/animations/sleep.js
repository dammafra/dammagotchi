import Misc from '@life/misc'

export default {
  default() {
    this.dispose && this.dispose()

    this.canInteract = true
    this.stats.sleep = true

    const [bed1, bed2] = this.sprites.get('bed')
    bed1.spawn()
    bed2.spawn()
    bed2.mesh.visible = false

    const [sleep1, sleep2, sleep3] = Misc.instance.getSleep()
    sleep1.spawn()
    sleep2.spawn()
    sleep3.spawn()
    sleep2.mesh.visible = false
    sleep3.mesh.visible = false
    sleep1.mesh.position.set(1.5, 1.4)
    sleep2.mesh.position.copy(sleep1.mesh.position)
    sleep3.mesh.position.copy(sleep1.mesh.position)

    this.screen.turnOff()

    this.update = null

    this.updateSeconds = () => {
      sleep1.mesh.visible = this.tick % 3 === 0
      sleep2.mesh.visible = this.tick % 3 === 1
      sleep3.mesh.visible = this.tick % 3 === 2

      bed1.mesh.visible = this.tick % 2 === 0
      bed2.mesh.visible = this.tick % 2 === 1
    }

    this.dispose = () => {
      this.stats.sleep = false
      this.screen.turnOn()

      sleep1.dispose()
      sleep2.dispose()
      sleep3.dispose()

      bed1.dispose()
      bed2.dispose()
    }
  },
}
