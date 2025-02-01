import { EventDispatcher } from 'three'
import Experience from './experience'
import Debug from './utils/debug'

export default class Frame extends EventDispatcher {
  constructor() {
    super()

    this.experience = Experience.instance
    this.debug = Debug.instance.addFolder('frame').close()

    this.canvas = this.experience.canvas
    this.element = document.querySelector('.frame path')
    this.enabled = true

    this.setup()

    // Resize event
    window.addEventListener('resize', this.resize)

    this.debug
      .add(this, 'enabled')
      .onChange(() => {
        this.canvas.classList.toggle('framed')
        this.resize()
      })
      .setValue(!Debug.active)
  }

  setup() {
    if (this.enabled) {
      const { width, height } = this.element.getBoundingClientRect()
      this.canvas.style.width = `${width * 0.8}px`
      this.canvas.style.height = `${height * 0.8}px`
    } else {
      this.canvas.style.width = `${window.innerWidth}px`
      this.canvas.style.height = `${window.innerHeight}px`
    }
  }

  resize = () => {
    this.setup()
    this.dispatchEvent({ type: 'resize' })
  }

  destroy() {
    window.removeEventListener('resize', this.resize)
  }
}
