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
    this.pointer = this.experience.pointer
    this.time = this.experience.time
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas

    this.parallaxIntensity = 0.1
    this.parallaxEase = 5

    this.setInstance()
    // this.setControls()

    this.debug.add(this, 'parallaxIntensity').min(0).max(2).step(0.1)
    this.debug.add(this, 'parallaxEase').min(1).max(10).step(0.5)
  }

  setInstance() {
    this.instance = new PerspectiveCamera(this.sizes.gridSize * 2, this.sizes.width / this.sizes.height, 0.1, 100) //prettier-ignore
    this.instance.position.y = 1
    this.scene.add(this.instance)

    this.debug.add(this.instance, 'fov').min(10).max(100).step(0.1)
    this.debug.add(this.instance.position, 'x').min(-100).max(100).step(0.1).name('positionX')
    this.debug.add(this.instance.position, 'y').min(-100).max(100).step(0.1).name('positionY')
    this.debug.add(this.instance.position, 'z').min(-100).max(100).step(0.1).name('positionZ')
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

  parallax() {
    const parallaxX = -this.pointer.x * this.parallaxIntensity
    const parallaxY = -this.pointer.y * this.parallaxIntensity

    this.instance.rotation.x += (parallaxY - this.instance.rotation.x) * this.parallaxEase * (this.time.delta / 1000) //prettier-ignore
    this.instance.rotation.y += (parallaxX - this.instance.rotation.y) * this.parallaxEase * (this.time.delta / 1000) //prettier-ignore
  }

  update() {
    this.parallax()

    if (this.controls) {
      this.controls.update()
    }
  }
}
