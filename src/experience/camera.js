import { PerspectiveCamera } from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Experience from './experience'
import Debug from './utils/debug'

export default class Camera {
  constructor() {
    // Setup
    this.experience = Experience.instance
    this.debug = Debug.instance.addFolder('camera')

    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas

    this.setInstance()
    // this.setControls()
  }

  setInstance() {
    this.instance = new PerspectiveCamera(50, this.sizes.width / this.sizes.height, 0.1, 100) //prettier-ignore
    this.instance.position.set(0, 1, 4)
    this.scene.add(this.instance)

    this.debug.add(this.instance, 'fov').min(10).max(100).step(0.1)
    this.debug.add(this.instance.position, 'x').min(0).max(100).step(0.1)
    this.debug.add(this.instance.position, 'y').min(0).max(100).step(0.1)
    this.debug.add(this.instance.position, 'z').min(0).max(100).step(0.1)
    this.debug.onChange(() => this.instance.updateProjectionMatrix())
  }

  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas)
    this.controls.enableDamping = true
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }

  update() {
    if (this.controls) {
      this.controls.update()
    }
  }
}
