import {
  AxesHelper,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PlaneGeometry,
  Scene,
  WebGLRenderTarget,
} from 'three'
import Experience from '../experience'
import Debug from '../utils/debug'
import ScreenCamera from './camera'
import ScreenEnvironment from './environment'
import ScreenGrid from './grid'

export default class Screen {
  static debugName = '📺 screen'

  constructor() {
    this.experience = Experience.instance
    this.debug = Debug.instance.gui?.addFolder({ title: Screen.debugName, expanded: false })
    this.renderer = this.experience.renderer

    this.renderTarget = new WebGLRenderTarget(256, 256)
    this.scene = new Scene()
    this.camera = new ScreenCamera()
    this.grid = new ScreenGrid()

    this.setGeometry()
    this.setMaterial()
    this.setMesh()
    this.setGlass()

    if (this.debug) {
      const helper = new AxesHelper(3)
      helper.position.z = this.grid.center.z
      this.scene.add(helper)

      this.debug.addBinding(helper, 'visible', { label: 'helper' })
    }
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
      transmission: 0.9,
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
    // this.room = new Room()

    this.debug?.addBinding(this.environment, 'flicker')
  }

  update() {
    this.renderer.instance.setRenderTarget(this.renderTarget)
    this.renderer.instance.render(this.scene, this.camera.instance)
    this.renderer.instance.setRenderTarget(null)

    if (this.environment) this.environment.update()
  }
}
