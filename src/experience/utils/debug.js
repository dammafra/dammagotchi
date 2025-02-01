import GUI from 'lil-gui'

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
    addEventListener('DOMContentLoaded', this.loadState)
    this.gui.add(this, 'resetState').name('Reset')
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
        camera: { controllers: { controls: true } },
        frame: { controllers: { enabled: false } },
      },
    }
    this.gui.load(defaultState)
  }

  destroy() {
    this.gui.destroy()
    Debug.instance = null
  }
}
