import iro from '@jaames/iro'
import { Color } from 'three'
import Frame from '../device/frame'
import Shell from '../device/shell'
import Experience from '../experience'
import { areColorsNear, randomColor } from './colors'

export default class ColorPicker {
  constructor() {
    this.experience = Experience.instance
    this.device = this.experience.device
    this.camera = this.experience.camera

    this.button = document.getElementById('colors')
    this.randomize = document.getElementById('randomize')
    this.element = document.getElementById('picker')

    this.button.onclick = this.toggle
    this.randomize.onclick = () => this.colorPicker.setColors([randomColor(), randomColor()])

    this.colorPicker = new iro.ColorPicker('#picker', {
      width: 200,
      layoutDirection: 'horizontal',
      colors: this.loadState(),
      layout: [
        {
          component: iro.ui.Box,
          options: {
            borderWidth: 2,
            borderColor: '#ffffff',
          },
        },
        {
          component: iro.ui.Slider,
          options: {
            sliderType: 'hue',
            borderWidth: 2,
            borderColor: '#ffffff',
          },
        },
      ],
    })

    this.colorPicker.on('color:change', this.onColorsChange)
    this.colorPicker.on('color:setAll', ([c1, c2]) => {
      this.onColorsChange(c1)
      this.onColorsChange(c2)
    })
  }

  onColorsChange = color => {
    color.index === 0
      ? this.setPrimaryColor(color.hexString)
      : this.setSecondaryColor(color.hexString)

    this.saveState()
  }

  setPrimaryColor(color) {
    Shell.material.color = new Color(color)
    const primaryColor = areColorsNear(color, '#ffffff', 100) ? '#bbbbbb' : color
    document.documentElement.style.setProperty('--color-primary', primaryColor)

    const metaTag = document.querySelector('meta[name="theme-color"]')
    metaTag.setAttribute('content', primaryColor)
  }

  setSecondaryColor(color) {
    Frame.material.color = new Color(color)

    const [a, b, c] = this.device.buttons
    a.mesh.material.color = new Color(color)
    b.mesh.material.color = new Color(color)
    c.mesh.material.color = new Color(color)
  }

  toggle = async () => {
    const visible = !this.element.classList.toggle('hidden')
    await this.camera.intro(0.5)
    if (visible) {
      this.camera.controls.dollyTo(5, true)
      this.camera.controls.truck(0, 0.5, true)
    }
  }

  hide() {
    this.element.classList.add('hidden')
  }

  saveState = () => {
    const state = this.colorPicker.colors.map(c => c.hexString)
    localStorage.setItem('colors', JSON.stringify(state))
  }

  loadState = () => {
    const state = localStorage.getItem('colors')
    let colors = JSON.parse(state)

    if (!colors) {
      colors = [randomColor(), randomColor()]
      localStorage.setItem('colors', JSON.stringify(colors))
    }

    this.setPrimaryColor(colors.at(0))
    this.setSecondaryColor(colors.at(1))

    return colors
  }
}
