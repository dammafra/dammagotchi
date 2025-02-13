import { EventDispatcher } from 'three'
import Experience from '../../experience'
import Random from '../../utils/random'
import Sprites from '../../utils/sprites'
import Time from '../../utils/time'

export default class Pet extends EventDispatcher {
  constructor(...args) {
    super()

    this.screen = Experience.instance.screen
    this.time = Time.instance

    this.environment = this.screen.environment
    this.grid = this.screen.grid
    this.camera = this.screen.camera

    if (args.length === 2) {
      const stage = args.at(0)
      const model = args.at(1)

      this.sprites = Sprites.for(`pets.${stage}.${model}`)
    } else {
      const sprite = args.at(0)
      this.sprites = Sprites.for(sprite)
    }

    this.sprites.addEventListener('ready', () => this.dispatchEvent({ type: 'ready' }))
  }

  transitionIn() {
    this.dispose && this.dispose()

    const idle1 = this.sprites.get('idle').at(0)
    idle1.spawn()

    this.environment.startFlicker()

    this.updateSeconds = null

    this.dispose = () => {
      idle1.dispose()
      this.environment.stopFlicker()
    }
  }

  idle = () => {
    this.dispose && this.dispose()

    const idle1 = this.sprites.get('idle').at(0)
    idle1.spawn()

    const idle2 = this.sprites.get('idle').at(1)
    idle2.spawn()
    idle2.mesh.visible = false

    this.updateSeconds = () => {
      idle1.mesh.visible = Random.boolean()

      const directionX = Random.oneOf(+this.grid.unit, -this.grid.unit)
      const directionZ = Random.oneOf(+this.grid.unit, -this.grid.unit)

      const position = idle1.mesh.position.clone()
      position.x += directionX
      position.z += directionZ

      if (this.camera.canView(position) && this.grid.contains(position)) {
        idle1.mesh.position.copy(position)
        idle1.mesh.rotation.y = directionX > 0 ? Math.PI : 0
      }

      idle2.copy(idle1)
      idle2.mesh.visible = !idle1.mesh.visible
    }

    this.dispose = () => {
      idle1.dispose()
      idle2.dispose()
    }
  }

  transitionOut() {
    this.dispose && this.dispose()

    const idle1 = this.sprites.get('idle').at(0)
    idle1.spawn()

    this.environment.startFlicker()

    this.updateSeconds = null

    this.dispose = () => {
      idle1.dispose()
      this.environment.stopFlicker()
    }
  }
}
