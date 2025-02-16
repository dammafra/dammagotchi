import CameraControls from 'camera-controls'
import {
  Box3,
  Matrix4,
  PerspectiveCamera,
  Quaternion,
  Raycaster,
  Sphere,
  Spherical,
  Vector2,
  Vector3,
  Vector4,
} from 'three'
import Experience from './experience'
import Debug from './utils/debug'
import Time from './utils/time'

const subsetOfTHREE = {
  Vector2: Vector2,
  Vector3: Vector3,
  Vector4: Vector4,
  Quaternion: Quaternion,
  Matrix4: Matrix4,
  Spherical: Spherical,
  Box3: Box3,
  Sphere: Sphere,
  Raycaster: Raycaster,
}

CameraControls.install({ THREE: subsetOfTHREE })

export default class Camera {
  static debugName = '🎥 camera'

  constructor() {
    // Setup
    this.experience = Experience.instance
    this.time = Time.instance
    this.debug = Debug.instance.gui?.addFolder({ title: Camera.debugName, expanded: false })

    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas

    this.setInstance()
    this.setParallax()
    this.setControls()
  }

  setInstance() {
    this.instance = new PerspectiveCamera(50, this.sizes.aspectRatio, 0.1, 100)
    this.instance.position.set(0, 10, 0)
    this.scene.add(this.instance)

    this.debug
      ?.addBinding(this.instance, 'fov', { min: 10, max: 100, step: 0.1 })
      .on('change', () => this.instance.updateProjectionMatrix())
    this.debug?.addBinding(this.instance, 'position')
  }

  setParallax() {
    this.parallaxIntensity = 0.1
    this.parallaxEase = 5

    this.debug?.addBinding(this, 'parallaxIntensity', { min: 0, max: 2, step: 0.1 })
    this.debug?.addBinding(this, 'parallaxEase', { min: 1, max: 10, step: 0.5 })
  }

  setControls() {
    this.controls = new CameraControls(this.instance, this.canvas)
    this.controls.smoothTime = 1.5
    this.controls.minDistance = 1.3
    this.controls.maxDistance = 10
  }

  resize() {
    this.instance.aspect = this.sizes.aspectRatio
    this.instance.updateProjectionMatrix()

    this.debug?.refresh()
  }

  update() {
    this.controls.update(this.time.delta)
  }

  distanceTo(position) {
    return this.instance.position.distanceTo(position)
  }

  async animation() {
    await this.controls.setLookAt(0, 0, -3, 0, 0, 0, !Debug.instance.active)
    Debug.instance.active && this.controls.dolly(2)
  }
}
