import Experience from '@experience'

export class Soundboard {
  /** @type {Soundboard} */
  static instance

  muted = true
  audioContext = new (window.AudioContext || window.webkitAudioContext)()
  buffers = {}

  static async init() {
    const instance = new Soundboard()
    await instance.loadSounds()
    return instance
  }

  constructor() {
    // Singleton
    if (Soundboard.instance) {
      return Soundboard.instance
    }
    Soundboard.instance = this
    this.experience = Experience.instance
    this.time = this.experience.time

    this.setMutedButton()
    this.setBackgorundMusicButton()
  }

  async loadSounds() {
    const soundFiles = {
      angry: 'sounds/angry.mp3',
      attention: 'sounds/attention.mp3',
      button: 'sounds/button.mp3',
      death: 'sounds/death.mp3',
      discipline: 'sounds/discipline.mp3',
      evolution: 'sounds/evolution.mp3',
      'game-start': 'sounds/game-start.mp3',
      happy: 'sounds/happy.mp3',
      hatching: 'sounds/hatching.mp3',
      'time-speed': 'sounds/time-speed.mp3',
    }

    const promises = Object.entries(soundFiles).map(async ([key, url]) => {
      const response = await fetch(url)
      const arrayBuffer = await response.arrayBuffer()
      this.buffers[key] = await this.audioContext.decodeAudioData(arrayBuffer)
    })

    await Promise.all(promises)
  }

  async playBackgroundMusic() {
    if (this.backgroundMusicSource) return

    const response = await fetch('sounds/background.mp3')
    const arrayBuffer = await response.arrayBuffer()

    this.backgroundMusicSource = this.audioContext.createBufferSource()

    const backgroundMusicBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
    this.backgroundMusicSource.buffer = backgroundMusicBuffer
    this.backgroundMusicSource.loop = true

    const gainNode = this.audioContext.createGain()
    gainNode.gain.value = 0.3
    this.backgroundMusicSource.connect(gainNode).connect(this.audioContext.destination)
    this.backgroundMusicSource.start()
  }

  async stopBackgroundMusic() {
    this.backgroundMusicSource?.stop()
    this.backgroundMusicSource = null
  }

  setMuted(value) {
    this.muted = value
  }

  async play(sound, times = 1) {
    if (!this.buffers[sound] || this.muted || !this.time.speedSetting) return

    let playCount = 0
    const playSound = () => {
      if (playCount >= times) return
      playCount++
      const source = this.audioContext.createBufferSource()
      source.buffer = this.buffers[sound]

      const gainNode = this.audioContext.createGain()
      gainNode.gain.value = 0.5

      source.playbackRate.value = this.time.speedSetting
      source.connect(gainNode).connect(this.audioContext.destination)
      source.start()
      source.onended = playSound
    }

    playSound()
  }

  toggleMuted = () => {
    this.muted = !this.muted

    if (!this.muted) this.play('button')

    this.button.firstElementChild.classList.toggle('fa-volume-high')
    this.button.firstElementChild.classList.toggle('fa-volume-xmark')
  }

  setMutedButton() {
    window.addEventListener('keypress', e => e.key === 'm' && this.toggleMuted())

    this.button = document.getElementById('muted')
    this.button.addEventListener('click', this.toggleMuted)
  }

  toggleBackgroundMusic = () => {
    this.backgroundMusic = !this.backgroundMusic
    this.backgroundMusic ? this.playBackgroundMusic() : this.stopBackgroundMusic()

    this.backgroundMusicButton.firstElementChild.children.item(1).classList.toggle('!hidden')
  }

  setBackgorundMusicButton() {
    window.addEventListener('keypress', e => e.key === 'b' && this.toggleBackgroundMusic())

    this.backgroundMusicButton = document.getElementById('music')
    this.backgroundMusicButton.addEventListener('click', this.toggleBackgroundMusic)
  }
}
