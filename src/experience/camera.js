import { PerspectiveCamera } from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Experience from './experience'
import Debug from './utils/debug'

export default class Camera {
  constructor() {
    // Setup
    this.experience = Experience.instance
    this.debug = Debug.instance.addFolder('camera').close()

    this.sizes = this.experience.sizes
    this.motion = this.experience.motion
    this.time = this.experience.time
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas

    this.setInstance()
    this.setParallax()
    this.setControls()
  }

  setInstance() {
    this.instance = new PerspectiveCamera(50, this.sizes.width / this.sizes.height, 0.1, 100) //prettier-ignore
    this.instance.position.y = 1
    this.scene.add(this.instance)

    this.debug.add(this.instance, 'fov').min(10).max(100).step(0.1)
    this.debug.add(this.instance.position, 'x').min(-100).max(100).step(0.1).name('positionX')
    this.debug.add(this.instance.position, 'y').min(-100).max(100).step(0.1).name('positionY')
    this.debug.add(this.instance.position, 'z').min(-100).max(100).step(0.1).name('positionZ')
    this.debug.onChange(() => this.instance.updateProjectionMatrix())
  }

  setParallax() {
    this.parallaxIntensity = 0.1
    this.parallaxEase = 5

    this.debug.add(this, 'parallaxIntensity').min(0).max(2).step(0.1)
    this.debug.add(this, 'parallaxEase').min(1).max(10).step(0.5)
  }

  setControls() {
    if (!Debug.active) return

    this.controls = new OrbitControls(this.instance, this.canvas)
    this.controls.enableDamping = true
    this.controls.enabled = false // trigger GUI controller onChange

    this.debug
      .add(this.controls, 'enabled')
      .name('controls')
      .onChange(enabled => {
        this.controls.reset()
        this.controls.target.set(
          this.sizes.gridCenter.x,
          enabled ? this.sizes.gridCenter.y : this.instance.position.y,
          this.sizes.gridCenter.z,
        )
      })
      .setValue(true)
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }

  updateParallax() {
    const parallaxX = -this.motion.x * this.parallaxIntensity
    const parallaxY = -this.motion.y * this.parallaxIntensity

    this.instance.rotation.x += (parallaxY - this.instance.rotation.x) * this.parallaxEase * (this.time.delta / 1000) //prettier-ignore
    this.instance.rotation.y += (parallaxX - this.instance.rotation.y) * this.parallaxEase * (this.time.delta / 1000) //prettier-ignore
  }

  update() {
    this.updateParallax()

    if (this.controls) {
      this.controls.update()
    }
  }
}
