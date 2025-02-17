export class SoundBoard {
  static muted = false

  static #buttonA = new Audio('sounds/button.mp3')

  static setMuted(value) {
    SoundBoard.muted = value
  }

  static playButtonA() {
    SoundBoard.#buttonA.load() // workaround for Safari audio delay

    SoundBoard.#buttonA.muted = SoundBoard.muted
    SoundBoard.#buttonA.currentTime = 0
    SoundBoard.#buttonA.play()
  }
}
