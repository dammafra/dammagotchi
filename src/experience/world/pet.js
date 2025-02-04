import Experience from '../experience'
import sprites from '../sprites'
import Debug from '../utils/debug'
import { dispose } from '../utils/dispose'
import SpritesExtractor from '../utils/sprites-extractor'
import Time from '../utils/time'

export const PetAge = Object.freeze({
  BABY: 'babies',
  CHILD: 'children',
  TEENAGER: 'teenagers',
  ADULT: 'adults',
  SENIOR: 'seniors',
})

export default class Pet {
  static debugName = '👾 pet'

  get spriteName() {
    return `pets.${this.age}.${this.model}`
  }

  /** @param {PetAge} age  */
  /** @param {string} model  */
  constructor(age, model) {
    this.experience = Experience.instance
    this.time = Time.instance
    this.debug = Debug.instance.gui.addFolder(Pet.debugName)

    this.grid = this.experience.grid
    this.scene = this.experience.scene
    this.camera = this.experience.camera

    this.age = age
    this.model = model

    SpritesExtractor.for(this.spriteName).addEventListener('ready', this.setup)

    this.debug.add(this, 'age', PetAge).onChange(age => {
      const modelOptions = Object.keys(sprites.pets[age])
      this.model = modelOptions.at(0)
      this.debug.controllers.at(1).options(modelOptions)
      SpritesExtractor.for(this.spriteName).addEventListener('ready', this.setup)
    })
    this.debug
      .add(this, 'model', Object.keys(sprites.pets[this.age]))
      .onChange(() => SpritesExtractor.for(this.spriteName).addEventListener('ready', this.setup))
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
