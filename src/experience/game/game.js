import Experience from '@experience'
import Icons from '@ui/icons'
import { dispose } from '@utils/dispose'
import { Group, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'
import Action from './action'

export default class Game {
  constructor() {
    this.experience = Experience.instance
    this.resources = this.experience.resources
    this.device = this.experience.device
    this.life = this.experience.life
    this.ui = this.experience.ui
    this.screen = this.experience.screen
    this.scene = this.screen.scene

    this.start()

    this.tick = 0
    this.speed = 2
    this.score = 0
    this.group = new Group()
    this.scene.add(this.group)

    this.setScoreMesh()
  }

  onB = () => {
    this.jumped = true
  }

  onC = () => {
    this.end(true)
  }

  start() {
    this.life.hide()
    this.ui.disableButtons()
    setTimeout(() => clearTimeout(this.ui.resetTimeout))
    this.ui.icons.setSelected(Icons.PLAY)
    this.device.addEventListener('press-A-button', this.onB)
    this.device.addEventListener('press-B-button', this.onB)
    this.device.addEventListener('press-C-button', this.onC)
  }

  end(cancel) {
    dispose(this.group)
    this.scene.remove(this.group)

    dispose(this.scoreMesh)
    this.scene.remove(this.scoreMesh)

    this.experience.endGame()
    this.life.show()

    if (!cancel) {
      if (this.score >= 3) {
        this.life.pet.happy()

        if (this.life.stats.happy < 3) {
          this.life.stats.happy += 2
        } else if (this.life.stats.happy < 4) {
          this.life.stats.happy++
        }

        if (this.life.stats.weight) {
          this.life.stats.weight--
        }

        this.life.stats.resolveNeeds()
      } else {
        this.life.pet.upset()
      }
    }
  }

  update() {
    this.action?.update && this.action.update()
  }

  updateSeconds() {
    if (!this.action) {
      this.action = new Action()
      this.action.intro()
    } else {
      this.tick++
      if (this.score > 3 && this.speed == 2) this.speed++
      if (this.score > 6 && this.speed == 3) this.speed++
      this.action.updateSeconds && this.action.updateSeconds()
    }
  }

  dispose() {
    this.ui.enableButtons()
    this.ui.reset()

    this.device.removeEventListener('press-A-button', this.onB)
    this.device.removeEventListener('press-B-button', this.onB)
    this.device.removeEventListener('press-C-button', this.onC)
  }

  setScoreMesh() {
    this.scoreMesh = new Mesh(
      new PlaneGeometry(),
      new MeshBasicMaterial({ transparent: true, map: this.resources.items.score0, opacity: 10 }),
    )
    this.scoreMesh.visible = false
    this.scoreMesh.position.x = this.screen.bounds.xMax - 0.5
    this.scoreMesh.position.y = this.screen.bounds.yMax - 1.5
    this.scoreMesh.position.z = this.screen.center.z
    this.scene.add(this.scoreMesh)
  }

  refreshScoreTexture() {
    this.scoreMesh.material.map = this.resources.items[`score${this.score}`]
    this.scoreMesh.material.needsUpdate = true
  }
}
