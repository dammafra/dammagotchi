import sourcesConfig from '@config/resources'
import Device from '@device/device'
import Game from '@game/game'
import Life from '@life/life'
import Screen from '@screen/screen'
import UI from '@ui/ui'
import Pointer from '@utils/pointer'
import Resources from '@utils/resources'
import Sizes from '@utils/sizes'
import Sprites from '@utils/sprites'
import Time from '@utils/time'
import { Scene } from 'three'
import Camera from './camera'
import Environment from './environment'
import Loading from './loading'
import Renderer from './renderer'
import Tutorial from './tutorial'

export default class Experience {
  /** @type {Experience} */
  static instance

  static init(canvas) {
    return new Experience(canvas)
  }

  constructor(canvas) {
    // Singleton
    if (Experience.instance) {
      return Experience.instance
    }

    Experience.instance = this

    // Options
    this.canvas = canvas

    // Setup
    this.time = new Time()
    this.sizes = new Sizes()
    this.resources = new Resources(sourcesConfig)
    this.loading = new Loading()

    this.scene = new Scene()
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.pointer = new Pointer()
    this.environment = new Environment()

    this.device = new Device()
    this.screen = new Screen()
    this.life = new Life()
    this.ui = new UI()

    // Events
    this.sizes.addEventListener('resize', this.resize)
    this.time.addEventListener('tick', this.update)
    this.time.addEventListener('tick-seconds', this.updateSeconds)
    this.resources.addEventListener('ready', this.ready)

    if (window.location.hash === '#debug' || document.querySelector('.debug')) {
      this.debug = true

      import('@utils/debug.js').then(({ default: Debug }) => {
        this.debug = new Debug()
        Sprites.setDebug(this.debug)

        for (const [key, value] of Object.entries(this)) {
          value.setDebug && value.setDebug(this.debug)
        }

        this.debug.loadState()
      })
    }
  }

  resize = () => {
    this.camera.resize()
    this.renderer.resize()
  }

  ready = async () => {
    this.resources.removeEventListener('ready', this.ready)

    this.environment.ready()
    this.device.ready()
    this.screen.ready()
    this.ui.ready()
    this.loading.ready()
    this.resourcesReady = true

    this.setTutorial()

    if (!this.debug) {
      await this.camera.intro()

      if (!this.tutorial.completed) this.tutorial.start()
    }
  }

  update = () => {
    this.loading.update()
    this.camera.update()
    this.renderer.update()

    if (!this.resourcesReady) return

    this.pointer.update()
    this.screen.update()
    this.device.update()
    this.life.update()
    if (this.game) this.game.update()
  }

  updateSeconds = () => {
    if (!this.resourcesReady) return
    this.life.updateSeconds()
    if (this.game) this.game.updateSeconds()
  }

  setTutorial() {
    this.tutorial = new Tutorial()
  }

  startGame() {
    if (this.game) return
    this.game = new Game()
  }

  endGame() {
    this.game.dispose()
    this.game = null
  }
}
