import Menu from './menu'

export default class MenuMeter extends Menu {
  constructor() {
    super(document.getElementById('menu-meter'))

    this.hasOptions = true

    const sections = Array.from(this.element.getElementsByClassName('section'))
    this.hungrySection = sections.at(0)
    this.hungryMeter = this.hungrySection.querySelector('.meter')
    this.happySection = sections.at(1)
    this.happyMeter = this.happySection.querySelector('.meter')
  }

  show() {
    this.setMeters()
    super.show()
  }

  cycle() {
    this.hungrySection.classList.toggle('hidden')
    this.happySection.classList.toggle('hidden')

    this.refreshMenu()
  }

  action() {
    this.cycle()
    return this
  }

  setMeters() {
    this.setMeter(this.hungryMeter, this.life.stats.hungry)
    this.setMeter(this.happyMeter, this.life.stats.happy)
  }

  setMeter(meter, value) {
    while (meter?.firstChild) meter.removeChild(meter.firstChild)

    const icons = Array(4)
      .fill(true)
      .map((_, i) => this.icon(i + 1 > value ? 'empty' : 'full'))

    meter?.append(...icons)
  }

  icon(type) {
    const icon = document.createElement('img')
    icon.src = `/sprites/ui/meter-${type}.webp`
    icon.style.width = icon.style.height = '48px'
    return icon
  }
}
