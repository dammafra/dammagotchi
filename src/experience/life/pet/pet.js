import { EventDispatcher } from 'three'
import lifeConfig from '../../config/life'
import Experience from '../../experience'
import { dispose } from '../../utils/dispose'
import Sprites from '../../utils/sprites'
import Time from '../../utils/time'

export default class Pet extends EventDispatcher {
  constructor(...args) {
    super()

    this.experience = Experience.instance
    this.time = Time.instance

    this.grid = this.experience.grid
    this.scene = this.experience.scene
    this.camera = this.experience.camera

    this.config = lifeConfig

    if (args.length === 3) {
      this.stage = args.at(0)
      this.model = args.at(1)
      this.transitioning = args.at(2)

      this.sprites = Sprites.for(`pets.${this.stage}.${this.model}`)
    } else {
      const sprite = args.at(0)
      this.transitioning = args.at(1)

      this.sprites = Sprites.for(sprite)
    }

    this.sprites.addEventListener('ready', () => this.dispatchEvent({ type: 'ready' }))
  }

  ready() {
    this.transitioning ? this.transitionIn() : this.idle()
  }

  transitionIn() {
    this.dispose && this.dispose()

    const idle1 = this.sprites.get('idle').at(0)
    idle1.mesh.visible = true
    idle1.mesh.position.copy(this.grid.center)
    this.scene.add(idle1.mesh)

    this.time.runAfterSeconds(this.idle, this.config.transitions[this.stage].in)

    this.updateSeconds = () => {}

    this.dispose = () => {
      dispose(idle1.mesh)
      this.scene.remove(idle1.mesh)
      this.experience.life.environment.stopFlicker()
    }
  }

  idle = () => {
    this.dispose && this.dispose()

    const idle1 = this.sprites.get('idle').at(0)
    const idle2 = this.sprites.get('idle').at(1)
    idle2.mesh.visible = false
    this.scene.add(idle1.mesh, idle2.mesh)

    this.updateSeconds = () => {
      idle1.mesh.visible = Math.random() - 0.5 > 0
      idle2.mesh.visible = !idle1.mesh.visible

      this.directionX = Math.random() - 0.5 > 0 ? +this.grid.unit : -this.grid.unit
      this.directionZ = Math.random() - 0.5 > 0 ? +this.grid.unit : -this.grid.unit

      const position = idle1.mesh.position.clone()
      position.x += this.directionX
      position.z += this.directionZ

      idle1.mesh.rotation.y = this.directionX > 0 ? Math.PI : 0
      idle2.mesh.rotation.y = idle1.mesh.rotation.y

      if (this.camera.canView(position) && this.grid.contains(position)) {
        idle1.mesh.position.copy(position)
        idle2.mesh.position.copy(position)
      }
    }

    this.dispose = () => {
      dispose(idle1.mesh)
      dispose(idle2.mesh)
      this.scene.remove(idle1.mesh, idle2.mesh)
    }
  }

  transitionOut() {
    this.dispose && this.dispose()

    const idle1 = this.sprites.get('idle').at(0)
    idle1.mesh.visible = true
    idle1.mesh.position.copy(this.grid.center)
    this.scene.add(idle1.mesh)

    this.time.runAfterSeconds(
      () => this.dispatchEvent({ type: 'transition-end' }),
      this.config.transitions[this.stage].out,
    )

    this.experience.life.environment.startFlicker()

    this.updateSeconds = () => {}

    this.dispose = () => {
      dispose(idle1.mesh)
      this.scene.remove(idle1.mesh)
    }
  }
}
