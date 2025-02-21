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
    this.time = this.experience.time

    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas

    this.setInstance()
    this.setControls()
  }

  setInstance() {
    this.instance = new PerspectiveCamera(50, this.sizes.aspectRatio, 0.1, 100)
    this.instance.position.set(0, 10, -3)
    this.scene.add(this.instance)
  }

  setControls() {
    this.controls = new CameraControls(this.instance, this.canvas)
    this.controls.enabled = false
    this.controls.minDistance = 1.3
    this.controls.maxDistance = 10
    this.controls.truckSpeed = 0
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

  async intro() {
    this.controls.enabled = false
    this.controls.smoothTime = 1.5
    await this.controls.setLookAt(0, 0, 3, 0, 0, 0, true)
    this.controls.enabled = true
  }

  setDebug(debug) {
    this.debug = debug.gui.addFolder({ title: Camera.debugName, expanded: false })

    this.debug
      .addBinding(this.instance, 'fov', { min: 10, max: 100, step: 0.1 })
      .on('change', () => this.instance.updateProjectionMatrix())
    this.debug.addBinding(this.instance, 'position')

    this.controls.setLookAt(0, 0, 3, 0, 0, 0)
    this.controls.dolly(2)
  }
}
