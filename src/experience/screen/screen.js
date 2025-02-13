import { Mesh, MeshBasicMaterial, PlaneGeometry, Scene, WebGLRenderTarget } from 'three'
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

    this.renderTarget = new WebGLRenderTarget(512, 512)
    this.scene = new Scene()
    this.camera = new ScreenCamera()
    this.grid = new ScreenGrid()

    this.setGeometry()
    this.setMaterial()
    this.setMesh()
  }

  setGeometry() {
    this.geometry = new PlaneGeometry()
  }

  setMaterial() {
    this.material = new MeshBasicMaterial({ map: this.renderTarget.texture })
  }

  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material)

    this.mesh.scale.setScalar(0.7)
    this.mesh.position.z = -0.251
    this.mesh.rotation.y = Math.PI

    this.debug
      ?.addBinding(this.mesh.scale, 'x', { min: -1, max: 1, step: 0.001, label: 'scale' })
      .on('change', e => this.mesh.scale.setScalar(e.value))
    this.debug?.addBinding(this.mesh.position, 'z', {min: -1, max: 1, step: 0.001, label: 'positionX'}) //prettier-ignore

    this.experience.scene.add(this.mesh)
  }

  ready() {
    this.environment = new ScreenEnvironment()
    // this.room = new Room()
  }

  update() {
    this.renderer.instance.setRenderTarget(this.renderTarget)
    this.renderer.instance.render(this.scene, this.camera.instance)
    this.renderer.instance.setRenderTarget(null)

    if (this.environment) this.environment.update()
  }
}
