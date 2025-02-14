import { DirectionalLight, EquirectangularReflectionMapping, SRGBColorSpace } from 'three'
import Experience from '../experience'
import Debug from '../utils/debug'

export default class Environment {
  static debugName = '🏡 environment'

  constructor() {
    // Setup
    this.experience = Experience.instance
    this.debug = Debug.instance.gui?.addFolder({ title: Environment.debugName, expanded: false })

    this.scene = this.experience.scene
    this.resources = this.experience.resources

    this.setLight()
    this.setEnvironmentMap()
  }

  setLight() {
    this.directionalLight = new DirectionalLight('white', 4)
    this.directionalLight.position.set(-3, 3, -2)

    this.directionalLight.castShadow = true
    this.directionalLight.shadow.mapSize.set(512, 512)
    this.directionalLight.shadow.camera.far = 10
    this.directionalLight.shadow.normalBias = 0.05

    this.scene.add(this.directionalLight)

    this.debug?.addBinding(this.directionalLight, 'intensity', { label: 'light intensity' })
    this.debug?.addBinding(this.directionalLight, 'position', { label: 'light position' })
    this.debug?.addBinding(this.directionalLight, 'castShadow', { label: 'shadows' })
  }

  setEnvironmentMap() {
    const environmentMap = this.resources.items.sceneBackground
    environmentMap.mapping = EquirectangularReflectionMapping
    environmentMap.colorSpace = SRGBColorSpace

    this.scene.environment = environmentMap
    this.scene.background = environmentMap

    this.scene.environmentIntensity = 2
    this.scene.backgroundIntensity = 2
    this.scene.backgroundBlurriness = 0.1

    this.debug?.addBinding(this.scene, 'environmentIntensity', { min: 0, max: 10, step: 0.1 })
    this.debug?.addBinding(this.scene, 'backgroundIntensity', { min: 0, max: 10, step: 0.1 })
    this.debug?.addBinding(this.scene, 'backgroundBlurriness', { min: 0, max: 1, step: 0.001 })
  }
}
