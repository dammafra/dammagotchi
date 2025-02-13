import * as EssentialsPlugin from '@tweakpane/plugin-essentials'
import { Pane } from 'tweakpane'
import Experience from '../experience'

export default class Debug {
  /** @type {Debug} */
  static instance

  static init() {
    return new Debug()
  }

  constructor() {
    // Singleton
    if (Debug.instance) {
      return Debug.instance
    }

    Debug.instance = this

    this.active = window.location.hash === '#debug'

    if (this.active) {
      this.gui = new Pane({ title: 'DEBUG' })

      this.gui.hidden = !this.active
      this.gui.element.parentElement.style.width = '350px'
      this.gui.element.parentElement.style.zIndex = 999

      this.preserveChanges = false
      this.gui.addBinding(this, 'preserveChanges', { label: 'preserve changes' })
      addEventListener('beforeunload', this.saveState)

      // Global access
      window.Experience = Experience

      // Stats
      this.stats = new Pane({ title: 'FPS' })
      this.stats.registerPlugin(EssentialsPlugin)

      this.stats.element.parentElement.style.left = '8px'

      this.stats = this.stats.addBlade({
        view: 'fpsgraph',
        label: 'FPS',
        rows: 2,
      })
    }
  }

  saveState = () => {
    if (!this.active || !this.preserveChanges) return

    const state = this.gui.exportState()
    localStorage.setItem('last_gui_state', JSON.stringify(state))
  }

  loadState = () => {
    if (!this.active) return

    const state = localStorage.getItem('last_gui_state')
    if (state) {
      this.gui.importState(JSON.parse(state))
      localStorage.removeItem('last_gui_state')
    }
  }
}
