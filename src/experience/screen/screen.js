import {
  Color,
  GridHelper,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Uniform,
  Vector3,
  WebGLRenderTarget,
} from 'three'
import lcdFragmentShader from '../../shaders/lcd/fragment.glsl'
import lcdVertexShader from '../../shaders/lcd/vertex.glsl'
import Experience from '../experience'
import ScreenCamera from './camera'
import Pixel from './pixel'

export default class Screen {
  static debugName = '📺 screen'

  constructor() {
    this.experience = Experience.instance
    this.time = this.experience.time
    this.resources = this.experience.resources
    this.renderer = this.experience.renderer
    this.mainCamera = this.experience.camera
    this.mainScene = this.experience.scene

    this.renderTarget = new WebGLRenderTarget(256, 256)
    this.scene = new Scene()
    this.screenCamera = new ScreenCamera()

    this.flicker = false
    this.flickerSpeed = 2

    this.setGrid()
    this.setGeometry()
    this.setMaterial()
    this.setMesh()
    this.setGlass()
    this.setDark()
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
    this.material = new ShaderMaterial({
      vertexShader: lcdVertexShader,
      fragmentShader: lcdFragmentShader,
      uniforms: {
        uMap: new Uniform(this.renderTarget.texture),
        uContrastFactor: new Uniform(2.0),
      },
    })
  }

  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material)

    this.mesh.scale.setScalar(0.71)
    this.mesh.position.z = 0.251

    this.mainScene.add(this.mesh)
  }

  setGlass() {
    this.glassMaterial = new MeshPhysicalMaterial({
      color: 0xbbbbbb,
      metalness: 0.1,
      roughness: 0.15,
      transmission: 1,
      thickness: 0.01,
      ior: 1.5,
    })

    this.glass = new Mesh(this.geometry, this.glassMaterial)
    this.glass.scale.copy(this.mesh.scale)
    this.glass.position.z = this.mesh.position.z + 0.001

    this.mainScene.add(this.glass)
  }

  setDark() {
    this.darkMaterial = new MeshBasicMaterial({ color: 'black', depthWrite: false })

    this.dark = new Mesh(this.geometry, this.darkMaterial)
    this.dark.visible = false
    this.dark.scale.y = 0.58
    this.dark.position.z = -2
    this.dark.position.y = 1.4

    this.scene.add(this.dark)
  }

  setEnvironmentMap() {
    const environmentMap = this.resources.items.screenBackground
    environmentMap.colorSpace = SRGBColorSpace

    this.scene.background = environmentMap

    this.backgroundIntensity = 0.5
    this.scene.backgroundIntensity = this.backgroundIntensity
  }

  setFlicker(value) {
    this.flicker = value

    if (!this.flicker) {
      Pixel.material?.color.set(new Color('black'))
      this.dark.visible = false
    }
  }

  ready() {
    this.setEnvironmentMap()
  }

  update() {
    this.renderer.instance.setRenderTarget(this.renderTarget)
    this.renderer.instance.render(this.scene, this.screenCamera.instance)
    this.renderer.instance.setRenderTarget(null)

    if (!this.debug) {
      this.glass.visible = this.mainCamera.distanceTo(this.glass.position) > 2.5
    }

    if (!this.flicker) return

    const toggle = Math.floor(this.time.elapsed * this.time.speed * this.flickerSpeed) % 2 === 0
    this.dark.visible = toggle
    Pixel.material.color.set(new Color(toggle ? 'white' : 'black'))
  }

  contains(sprite, position) {
    const leftBound = position.clone()
    leftBound.x += -this.unit * (sprite.width / 2)

    const rightBound = position.clone()
    rightBound.x += this.unit * (sprite.width / 2)

    return this.screenCamera.canView(leftBound) && this.screenCamera.canView(rightBound)
  }

  setDebug(debug) {
    this.debug = debug.gui.addFolder({ title: Screen.debugName, expanded: false })

    const helper = new GridHelper(10, 10)
    helper.position.z = this.center.z - 0.001
    helper.rotation.x = Math.PI * 0.5
    this.scene.add(helper)

    this.glass.visible = false

    this.debug.addBinding(helper, 'visible', { label: 'helper' })

    this.debug
      ?.addBinding(this.mesh.scale, 'x', { min: -1, max: 1, step: 0.001, label: 'scale' })
      .on('change', e => this.mesh.scale.setScalar(e.value))
    this.debug.addBinding(this.mesh.position, 'z', {min: -1, max: 1, step: 0.001, label: 'positionZ'}) //prettier-ignore

    this.debug.addBinding(this.glass, 'visible', { label: 'glass' })
    this.debug.addBinding(this.glassMaterial, 'metalness', { min: 0, max: 1, step: 0.001 })
    this.debug.addBinding(this.glassMaterial, 'roughness', { min: 0, max: 1, step: 0.001 })
    this.debug.addBinding(this.glassMaterial, 'transmission', { min: 0, max: 1, step: 0.001 })
    this.debug.addBinding(this.glassMaterial, 'thickness', { min: 0, max: 1, step: 0.001 })
    this.debug.addBinding(this.glassMaterial, 'ior', { min: 1, max: 2.333, step: 0.001 })

    this.debug.addBinding(this, 'flicker')
  }
}
