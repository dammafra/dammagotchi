import GUI from 'lil-gui'

export default class Debug {
  static active = true //window.location.hash === '#debug'
  static instance = new GUI().show(Debug.active)
}
