import { EventDispatcher } from 'three'
import Experience from '../experience'
import Debug from '../utils/debug'
import Time from '../utils/time'

export default class Frame extends EventDispatcher {
  static debugName = '🖼️ frame'

  constructor() {
    super()

    this.experience = Experience.instance
    this.time = Time.instance
    this.debug = Debug.instance.gui.addFolder(Frame.debugName).close()

    this.canvas = this.experience.canvas
    this.element = document.querySelector('.frame path')
    this.enabled = true

    this.setup()

    // Resize event
    window.addEventListener('resize', this.resize)

    this.observer = new ResizeObserver(this.resize)
    this.observer.observe(this.element)

    this.debug
      .add(this, 'enabled')
      .onChange(() => {
        this.canvas.classList.toggle('framed')
        this.resize()
      })
      .setValue(!Debug.instance.active)
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
    this.observer.disconnect()
  }
}
