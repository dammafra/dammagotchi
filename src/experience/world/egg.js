import Experience from '../experience'
import Debug from '../utils/debug'
import { dispose } from '../utils/dispose'
import SpritesExtractor from '../utils/sprites-extractor'
import Time from '../utils/time'

export default class Egg {
  static debugName = '🥚 egg'

  constructor() {
    this.experience = Experience.instance
    this.time = Time.instance
    this.debug = Debug.instance.gui.addFolder(Egg.debugName)

    this.grid = this.experience.grid
    this.scene = this.experience.scene
    this.camera = this.experience.camera

    this.sprites = SpritesExtractor.for('others')
    this.sprites.addEventListener('ready', this.idle)

    this.debug.add(this, 'idle')
    this.debug.add(this, 'hatching')
  }

  idle = () => {
    this.dispose && this.dispose()

    const normal = this.sprites.get('egg').at(0)
    const squeezed = this.sprites.get('egg').at(1)
    squeezed.mesh.visible = false

    this.scene.add(normal.mesh, squeezed.mesh)

    this.updateSeconds = () => {
      normal.mesh.visible = !normal.mesh.visible
      squeezed.mesh.visible = !squeezed.mesh.visible
    }

    this.dispose = () => {
      dispose(normal.mesh)
      dispose(squeezed.mesh)
      this.scene.remove(normal.mesh, squeezed.mesh)
    }
  }

  hatching = () => {
    this.dispose && this.dispose()

    const hatching = this.sprites.get('egg').at(0)
    hatching.mesh.visible = true
    this.scene.add(hatching.mesh)

    this.updateSeconds = () => {
      hatching.mesh.position.x += this.time.elapsedSeconds % 2 ? this.grid.unit : -this.grid.unit
    }

    this.dispose = () => {
      dispose(hatching.mesh)
      this.scene.remove(hatching.mesh)
    }
  }
}
