import Experience from '@experience'

export default class Countdown {
  constructor(seconds, callback) {
    this.experience = Experience.instance
    this.pointer = this.experience.pointer
    this.sizes = this.experience.sizes

    this.total = seconds
    this.remaining = this.total
    this.callback = callback

    this.display()
    this.init()
    this.start()
  }

  display() {
    this.element = document.querySelector('#countdown')
    this.element.classList.remove('hidden')

    const { width, height } = this.element.getBoundingClientRect()
    this.element.style.top = `${this.pointer.clientY - height / 2}px`
    this.element.style.left = `${this.pointer.clientX - width / 2}px`
  }

  init() {
    this.progress = document.getElementById('progress')
    this.circumference = 2 * Math.PI * +this.progress.getAttribute('r')

    this.progress.style.transition = `stroke-dashoffset ${this.total}s linear`
    this.progress.style.strokeDasharray = this.circumference
    this.progress.style.strokeDashoffset = 0
  }

  start() {
    setTimeout(() => (this.progress.style.strokeDashoffset = this.circumference))

    this.interval = setInterval(() => {
      this.remaining--
      if (this.remaining <= 0) {
        this.reset()
        this.callback && this.callback()
      }
    }, 1000)
  }

  reset() {
    clearInterval(this.interval)
    this.element.classList.add('hidden')
    this.progress.style.strokeDashoffset = 0
  }
}
