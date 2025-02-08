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
    this.debug = Debug.instance.gui?.addFolder({ title: Frame.debugName, expanded: false })

    this.canvas = this.experience.canvas
    this.element = document.querySelector('.frame path')
    this.heading = document.querySelector('.heading')
    this.buttons = document.querySelector('.buttons')
    this.enabled = true

    this.setup()

    // Resize event
    window.addEventListener('resize', this.resize)

    this.observer = new ResizeObserver(this.resize)
    this.observer.observe(this.element)

    this.debug?.addBinding(this, 'enabled').on('change', () => {
      this.canvas.classList.toggle('framed')
      this.resize()
    })

    // TODO: create class
    const buttonSound = new Audio('sounds/button.mp3')
    this.buttons.querySelectorAll('button').forEach(button =>
      button.addEventListener('click', () => {
        buttonSound.load() // workaround for Safari audio delay
        buttonSound.currentTime = 0
        buttonSound.play()
      }),
    )
  }

  setup() {
    if (this.enabled) {
      const { width, height, top, bottom } = this.element.getBoundingClientRect()
      this.canvas.style.width = `${width * 0.8}px`
      this.canvas.style.height = `${height * 0.8}px`

      this.heading.style.width = `${width + 400}px`
      this.heading.style.top = `${top - 120}px`

      this.buttons.style.top = `${bottom + 10}px`
    } else {
      this.canvas.style.width = `${window.innerWidth}px`
      this.canvas.style.height = `${window.innerHeight}px`
    }
  }

  update() {
    const morf = Math.ceil(Math.sin(this.time.elapsed * 0.0005) * 60)
    this.heading.style.fontVariationSettings = `'MORF' ${morf}`
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
