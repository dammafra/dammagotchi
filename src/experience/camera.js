import { Frustum, Matrix4, PerspectiveCamera } from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Experience from './experience'
import Debug from './utils/debug'
import Time from './utils/time'

export default class Camera {
  static debugName = '🎥 camera'

  constructor() {
    // Setup
    this.experience = Experience.instance
    this.time = Time.instance
    this.debug = Debug.instance.gui.addFolder({ title: Camera.debugName, expanded: false })

    this.sizes = this.experience.sizes
    this.grid = this.experience.grid
    this.motion = this.experience.motion
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas

    this.setInstance()
    this.setParallax()
    this.setControls()
  }

  setInstance() {
    this.instance = new PerspectiveCamera(50, this.sizes.aspectRatio, 0.1, 100)
    this.instance.position.y = 1
    this.scene.add(this.instance)

    this.debug
      .addBinding(this.instance, 'fov', { min: 10, max: 100, step: 0.1 })
      .on('change', () => this.instance.updateProjectionMatrix())
    this.debug.addBinding(this.instance, 'position')
  }

  setParallax() {
    this.parallaxIntensity = 0.1
    this.parallaxEase = 5

    this.debug.addBinding(this, 'parallaxIntensity', { min: 0, max: 2, step: 0.1 })
    this.debug.addBinding(this, 'parallaxEase', { min: 1, max: 10, step: 0.5 })
  }

  setControls() {
    if (!Debug.instance.active) return

    this.controls = new OrbitControls(this.instance, this.canvas)
    this.controls.enableDamping = true
    this.controls.enabled = false

    this.debug.addBinding(this.controls, 'enabled', { label: 'controls' }).on('change', () => {
      this.controls.reset()
      this.controls.target.set(
        this.grid.center.x,
        this.controls.enabled ? this.grid.center.y : this.instance.position.y,
        this.grid.center.z,
      )
    })
  }

  resize() {
    this.instance.aspect = this.sizes.aspectRatio
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

    if (this.controls && this.controls.enabled) {
      this.controls.update()
    }
  }

  canView(position) {
    const frustum = new Frustum()
    const matrix = new Matrix4().multiplyMatrices(
      this.instance.projectionMatrix,
      this.instance.matrixWorldInverse,
    )
    frustum.setFromProjectionMatrix(matrix)
    return frustum.containsPoint(position)
  }
}
