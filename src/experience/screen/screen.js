import {
  GridHelper,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PlaneGeometry,
  Scene,
  Vector3,
  WebGLRenderTarget,
} from 'three'
import Experience from '../experience'
import Debug from '../utils/debug'
import ScreenCamera from './camera'
import ScreenEnvironment from './environment'
import UI from './ui'

export default class Screen {
  static debugName = '📺 screen'

  constructor() {
    this.experience = Experience.instance
    this.debug = Debug.instance.gui?.addFolder({ title: Screen.debugName, expanded: false })
    this.renderer = this.experience.renderer
    this.mainCamera = this.experience.camera

    this.renderTarget = new WebGLRenderTarget(256, 256)
    this.scene = new Scene()
    this.screenCamera = new ScreenCamera()

    this.setGrid()
    this.setGeometry()
    this.setMaterial()
    this.setMesh()
    this.setGlass()

    if (this.debug) {
      const helper = new GridHelper(10, 10)
      helper.position.z = this.center.z - 0.001
      helper.rotation.x = Math.PI * 0.5
      this.scene.add(helper)

      this.debug.addBinding(helper, 'visible', { label: 'helper' })
    }
  }

  setGrid() {
    this.unit = 0.1
    this.size = 24

    const zeroCoordinate = this.unit / 2
    this.center = new Vector3(zeroCoordinate, zeroCoordinate, zeroCoordinate - this.size / 4)
  }

  setGeometry() {
    this.geometry = new PlaneGeometry()
  }

  setMaterial() {
    this.material = new MeshBasicMaterial({ map: this.renderTarget.texture })
  }

  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material)

    this.mesh.scale.setScalar(0.71)
    this.mesh.position.z = -0.251
    this.mesh.rotation.y = Math.PI

    this.debug
      ?.addBinding(this.mesh.scale, 'x', { min: -1, max: 1, step: 0.001, label: 'scale' })
      .on('change', e => this.mesh.scale.setScalar(e.value))
    this.debug?.addBinding(this.mesh.position, 'z', {min: -1, max: 1, step: 0.001, label: 'positionZ'}) //prettier-ignore

    this.experience.scene.add(this.mesh)
  }

  setGlass() {
    this.glassMaterial = new MeshPhysicalMaterial({
      metalness: 0.1,
      roughness: 0.15,
      transmission: 1,
      thickness: 0.01,
      ior: 1.5,
    })

    this.glass = new Mesh(this.geometry, this.glassMaterial)
    this.glass.visible = !Debug.instance.active
    this.glass.scale.copy(this.mesh.scale)
    this.glass.position.copy(this.mesh.position)
    this.glass.rotation.copy(this.mesh.rotation)

    this.experience.scene.add(this.glass)

    this.debug?.addBinding(this.glass, 'visible', { label: 'glass' })
    this.debug?.addBinding(this.glassMaterial, 'metalness', { min: 0, max: 1, step: 0.001 })
    this.debug?.addBinding(this.glassMaterial, 'roughness', { min: 0, max: 1, step: 0.001 })
    this.debug?.addBinding(this.glassMaterial, 'transmission', { min: 0, max: 1, step: 0.001 })
    this.debug?.addBinding(this.glassMaterial, 'thickness', { min: 0, max: 1, step: 0.001 })
    this.debug?.addBinding(this.glassMaterial, 'ior', { min: 1, max: 2.333, step: 0.001 })
  }

  ready() {
    this.environment = new ScreenEnvironment()
    this.ui = new UI()
    this.debug?.addBinding(this.environment, 'flicker')
  }

  update() {
    this.renderer.instance.setRenderTarget(this.renderTarget)
    this.renderer.instance.render(this.scene, this.screenCamera.instance)
    this.renderer.instance.setRenderTarget(null)

    if (!Debug.instance.active) {
      this.glass.visible = this.mainCamera.distanceTo(this.glass.position) > 2.5
    }

    if (this.environment) this.environment.update()
  }

  contains(sprite, position) {
    const leftBound = position.clone()
    leftBound.x += -this.unit * (sprite.width / 2)

    const rightBound = position.clone()
    rightBound.x += this.unit * (sprite.width / 2)

    return this.screenCamera.canView(leftBound) && this.screenCamera.canView(rightBound)
  }
}
