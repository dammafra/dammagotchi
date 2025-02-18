import Experience from './experience'

export default class Loading {
  constructor() {
    this.experience = Experience.instance
    this.time = this.experience.time

    this.element = document.querySelector('.loading')
  }

  ready() {
    this.element.classList.add('end')
    setTimeout(this.dispose, 2000)
  }

  update() {
    if (!this.element) return

    const morf = Math.abs(Math.sin(this.time.elapsed / this.time.speed) * 60)
    this.element.querySelector('p').style.fontVariationSettings = `'MORF' ${morf}`
  }

  dispose = () => {
    this.element.remove()
    this.element = null
  }
}
