import GUI from 'lil-gui'
import Camera from '../camera'
import Experience from '../experience'
import Frame from '../ui/frame'

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
    this.gui = new GUI().show(this.active)

    addEventListener('beforeunload', this.saveState)
    this.gui.add(this, 'resetState').name('↩️ reset')

    if (this.active) {
      // Global access
      window.Experience = Experience
    }
  }

  saveState = () => {
    if (!this.active) return

    const state = this.gui.save()
    localStorage.setItem('last_gui_state', JSON.stringify(state))
  }

  loadState = () => {
    if (!this.active) return

    const state = localStorage.getItem('last_gui_state')
    if (state) {
      this.gui.load(JSON.parse(state))
      localStorage.removeItem('last_gui_state')
    }
  }

  resetState = () => {
    const defaultState = {
      folders: {
        [Camera.debugName]: { controllers: { controls: true } },
        [Frame.debugName]: { controllers: { enabled: false } },
      },
    }

    this.gui.reset()
    this.gui.load(defaultState)
  }

  destroy() {
    Debug.instance = null
    this.gui.destroy()
    removeEventListener('beforeunload', this.saveState)
  }
}
