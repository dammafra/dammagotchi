import Experience from '../experience'
import Time from '../utils/time'

export default class Font {
  constructor() {
    this.experience = Experience.instance
    this.time = Time.instance

    this.elements = document.querySelectorAll('.font-kablammo')
  }

  update() {
    const morf = Math.ceil(Math.sin(this.time.elapsed * 0.0005) * 60)

    this.elements.forEach(element => {
      element.style.fontVariationSettings = `'MORF' ${morf}`
    })
  }
}
