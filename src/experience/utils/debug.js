import Experience from '@experience'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { Pane } from 'tweakpane'

export default class Debug {
  constructor() {
    this.gui = new Pane({ title: 'DEBUG' })

    this.gui.element.parentElement.style.width = '350px'
    this.gui.element.parentElement.style.zIndex = 999

    this.preserveChanges = false
    this.gui.addBinding(this, 'preserveChanges', { label: 'preserve changes' })
    addEventListener('beforeunload', this.saveState)

    // Global access
    window.Experience = Experience

    // Stats
    this.stats = new Stats()
    document.body.appendChild(this.stats.dom)
  }

  saveState = () => {
    if (!this.preserveChanges) return

    const state = this.gui.exportState()
    localStorage.setItem('debug', JSON.stringify(state))
  }

  loadState = () => {
    const state = localStorage.getItem('debug')
    if (state) {
      this.gui.importState(JSON.parse(state))
      localStorage.removeItem('debug')
    }
  }
}
