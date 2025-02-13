import { Mesh, MeshBasicMaterial, PlaneGeometry, Scene, WebGLRenderTarget } from 'three'
import Experience from '../experience'
import ScreenCamera from './camera'
import ScreenEnvironment from './environment'
import ScreenGrid from './grid'
import Room from './room'

export default class Screen {
  constructor() {
    this.experience = Experience.instance
    this.renderer = this.experience.renderer

    this.renderTarget = new WebGLRenderTarget(512, 512)
    this.scene = new Scene()
    this.camera = new ScreenCamera()
    this.grid = new ScreenGrid()

    this.setMesh()
  }

  update() {
    this.renderer.instance.setRenderTarget(this.renderTarget)
    this.renderer.instance.render(this.scene, this.camera.instance)
    this.renderer.instance.setRenderTarget(null)

    if (this.environment) this.environment.update()
  }

  readyResources() {
    this.environment = new ScreenEnvironment()
    this.room = new Room()
  }

  setMesh() {
    const planeGeometry = new PlaneGeometry()
    const planeMaterial = new MeshBasicMaterial({ map: this.renderTarget.texture })
    const plane = new Mesh(planeGeometry, planeMaterial)
    this.experience.scene.add(plane)
  }
}
