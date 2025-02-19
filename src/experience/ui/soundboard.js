import Experience from '../experience'

export class Soundboard {
  /** @type {Soundboard} */
  static instance

  muted = false
  #sounds = {
    button: new Audio('sounds/button.mp3'),
    hatching: new Audio('sounds/hatching.mp3'),
    death: new Audio('sounds/death.mp3'),
    happy: new Audio('sounds/happy.mp3'),
    attention: new Audio('sounds/attention.mp3'),
  }

  static init() {
    return new Soundboard()
  }

  constructor() {
    // Singleton
    if (Soundboard.instance) {
      return Soundboard.instance
    }
    Soundboard.instance = this
    this.experience = Experience.instance
    this.time = this.experience.time
  }

  setMuted(value) {
    this.muted = value
  }

  async play(sound, times = 1) {
    let playCount = 0
    const audio = this.#sounds[sound]
    audio.load() // workaround for Safari audio delay

    audio.addEventListener('ended', () => {
      playCount++
      if (playCount < times) {
        this.#play(audio)
      }
    })

    this.#play(audio)
  }

  #play(audio) {
    audio.volume = 0.5
    audio.muted = this.muted || !this.time.speedSetting
    audio.currentTime = 0
    audio.playbackRate = this.time.speedSetting
    audio.play()
  }
}
