import Experience from '../experience'
import { dispose } from '../utils/dispose'
import SpritesExtractor from '../utils/sprites-extractor'
import Time from '../utils/time'

export default class Pet {
  static debugName = '👾 pet'

  get spriteName() {
    return `pets.${this.age}.${this.model}`
  }

  constructor(age, model) {
    this.experience = Experience.instance
    this.time = Time.instance

    this.grid = this.experience.grid
    this.scene = this.experience.scene
    this.camera = this.experience.camera

    this.age = age
    this.model = model

    SpritesExtractor.for(this.spriteName).addEventListener('ready', this.setup)
  }

  setup = ({ instance }) => {
    this.sprites = instance
    this.idle()
  }

  // hatching = () => {
  //   this.dispose && this.dispose()

  //   const hatching = this.sprites.get('hatching').at(0)
  //   this.scene.add(hatching.mesh)

  //   this.updateSeconds = () => {}

  //   this.dispose = () => {
  //     dispose(hatching.mesh)
  //     this.scene.remove(hatching.mesh)
  //   }
  // }

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
}
