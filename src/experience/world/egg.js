import Experience from '../experience'
import sprites from '../sprites'
import Debug from '../utils/debug'
import { dispose } from '../utils/dispose'
import Sprite from './sprite'

export default class Egg {
  constructor() {
    this.experience = Experience.instance
    this.debug = Debug.instance.addFolder('egg')
    this.debug.add(this, 'idle')
    this.debug.add(this, 'hatching')
    this.debug.add(this, 'birth')
    this.debug.add(this, 'life')

    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.time = this.experience.time

    this.life()
  }

  // rotate() {
  //   this.normal.mesh.rotation.y += Math.PI
  //   this.normal.mesh.position.x = -this.normal.mesh.position.x
  // }

  idle() {
    this.dispose && this.dispose()

    const normal = new Sprite(sprites.egg.normal)
    const squeezed = new Sprite(sprites.egg.squeezed)
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

  hatching() {
    this.dispose && this.dispose()

    const hatching = new Sprite(sprites.egg.hatching)
    this.scene.add(hatching.mesh)

    this.updateSeconds = () => {
      hatching.mesh.position.x += this.time.elapsedSeconds % 2 ? this.sizes.unit : -this.sizes.unit
    }

    this.dispose = () => {
      dispose(hatching.mesh)
      this.scene.remove(hatching.mesh)
    }
  }

  birth() {
    this.dispose && this.dispose()

    const birth1 = new Sprite(sprites.egg.birth1)
    const birth2 = new Sprite(sprites.egg.birth2)
    const birth3 = new Sprite(sprites.egg.birth3)
    birth2.mesh.visible = false
    birth3.mesh.visible = false
    this.scene.add(birth1.mesh, birth2.mesh, birth3.mesh)

    this.updateSeconds = () => {
      birth1.mesh.visible = this.time.elapsedSeconds % 3 === 0
      birth2.mesh.visible = this.time.elapsedSeconds % 3 === 1
      birth3.mesh.visible = this.time.elapsedSeconds % 3 === 2
    }

    this.dispose = () => {
      dispose(birth1.mesh)
      dispose(birth2.mesh)
      dispose(birth3.mesh)
      this.scene.remove(birth1.mesh, birth2.mesh, birth3.mesh)
    }
  }

  life() {
    this.dispose && this.dispose()

    const life1 = new Sprite(sprites.baby.life1)
    const life2 = new Sprite(sprites.baby.life2)
    life2.mesh.visible = false
    this.scene.add(life1.mesh, life2.mesh)

    this.updateSeconds = () => {
      life1.mesh.visible = Math.random() - 0.5 > 0
      life2.mesh.visible = !life1.mesh.visible

      const direction = Math.random() - 0.5 > 0 ? 'x' : 'z'
      life1.mesh.position[direction] +=
        Math.random() - 0.5 > 0 ? +this.sizes.unit : -this.sizes.unit
      life2.mesh.position.copy(life1.mesh.position)
    }

    this.dispose = () => {
      dispose(life1.mesh)
      dispose(life2.mesh)
      this.scene.remove(life1.mesh, life2.mesh)
    }
  }
}
