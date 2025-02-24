import lifeConfig from '@config/life'
import spritesConfig from '@config/sprites'
import Experience from '@experience'
import { EventDispatcher, Group } from 'three'
import Food from './food'
import Misc from './misc'
import Baby from './pet/baby'
import Death from './pet/death'
import Egg from './pet/egg'
import Pet from './pet/pet'
import Senior from './pet/senior'
import Stats from './stats'

export default class Life extends EventDispatcher {
  static debugName = '📊 life'

  get scheduledFormatted() {
    return Array.from(this.scheduled.keys())
      .sort((a, b) => a - b)
      .map(key => [key, this.scheduled.get(key)])
      .map(([key, value]) => `${key}: ${value.label}`)
      .join('\n')
  }

  constructor() {
    super()

    this.experience = Experience.instance
    this.scene = this.experience.screen.scene

    const state = this.loadState()
    this.started = state.started
    this.age = state.age
    this.stageStart = state.stageStart
    this.stage = state.stage
    this.model = state.model

    this.pause = true
    this.scheduled = new Map()
    this.stats = new Stats()

    this.group = new Group()
    this.scene.add(this.group)

    if (this.started) this.start()
  }

  start() {
    if (this.started && !this.loading) return

    Food.init()
    Misc.init()
    this.started = true
    this.pause = false
    this.setPet()
  }

  setPet(evolving) {
    this.previousPet = this.pet

    switch (this.stage) {
      case 'egg':
        this.model = ''
        this.pet = new Egg()
        break

      case 'babies':
        this.setModel()
        this.pet = new Baby(this.model)
        break

      case 'seniors':
        this.setModel()
        this.pet = new Senior(this.model)
        break

      case 'death':
        this.model = ''
        this.pet = new Death()
        break

      default:
        this.setModel()
        this.pet = new Pet(this.stage, this.model)
        break
    }

    this.pet.addEventListener('ready', () => this.ready(evolving))
    this.loading = false
  }

  ready = evolving => {
    this.previousPet && this.previousPet.dispose && this.previousPet.dispose()

    if (evolving && this.pet.evolveIn) {
      this.pet.evolveIn()
      const transitionDuration = lifeConfig.transitions[this.stage].in
      this.schedule(this.startStage, this.age + transitionDuration, `start ${this.stage} stage`)
    } else {
      this.startStage()
    }
  }

  startStage = () => {
    this.pet.idle()

    if (this.stage !== 'death') {
      const stageDuration = lifeConfig.stages[this.stage]
      this.schedule(this.evolveOut, this.stageStart + stageDuration, 'evolve out')
    }

    this.experience.screen.setFlicker(false)
  }

  evolveOut = () => {
    this.experience.screen.setFlicker(this.stage !== 'egg' && this.stage !== 'seniors')
    this.dispatchEvent({ type: 'evolve-out' })

    if (this.pet.evolveOut) {
      this.pet.evolveOut()
      const transitionDuration = lifeConfig.transitions[this.stage].out
      this.schedule(this.evolveIn, this.age + transitionDuration, 'evolve in')
    } else {
      this.evolveIn()
    }
  }

  evolveIn = () => {
    const stages = Object.keys(lifeConfig.stages)
    const index = stages.findIndex(s => s == this.stage)
    this.stage = stages.at(index + 1)
    this.stageStart = this.age

    this.setPet(true)
  }

  updateSeconds() {
    if (!this.pause && this.stage !== 'death') this.age++
    this.checkScheduled()
    if (this.pet && this.pet.updateSeconds) this.pet.updateSeconds()
    this.saveState()
  }

  schedule(action, age, label) {
    this.scheduled.set(age, { label, action })
  }

  checkScheduled() {
    for (const key of this.scheduled.keys()) {
      if (this.age >= key) {
        this.scheduled.get(key).action()
        this.scheduled.delete(key)
      }
    }
  }

  setModel() {
    if (this.loading) return

    const keys = Object.keys(spritesConfig.pets[this.stage])
    const randomModel = keys[Math.floor(Math.random() * keys.length)]
    this.model = randomModel
  }

  saveState() {
    const state = {
      started: this.started,
      age: this.age,
      stageStart: this.stageStart,
      stage: this.stage,
      model: this.model,
    }
    localStorage.setItem('life', JSON.stringify(state))
  }

  loadState() {
    const state = localStorage.getItem('life')
    if (state) {
      this.loading = true
      return JSON.parse(state)
    } else {
      return {
        started: false,
        age: 0,
        stageStart: 0,
        stage: 'egg',
        model: '',
      }
    }
  }

  reset = () => {
    this.started = false
    this.age = 0
    this.stageStart = 0
    this.stage = 'egg'
    this.model = ''
    this.scheduled.clear()
    this.start()
    this.dispatchEvent({ type: 'evolve-out' })
  }

  show() {
    this.group.visible = true
  }

  hide() {
    this.group.visible = false
  }

  setDebug(debug) {
    this.debug = debug.gui.addFolder({ title: Life.debugName })

    this.debug.addBinding(this, 'pause')
    this.debug.addBinding(this, 'stage', { readonly: true })
    this.debug.addBinding(this, 'stageStart', { readonly: true })
    this.debug.addBinding(this, 'model', { readonly: true })
    this.debug.addBinding(this, 'age', { readonly: true })
    this.debug.addBinding(this, 'scheduledFormatted', {
      label: 'schedule',
      readonly: true,
      multiline: true,
      rows: 5,
    })
    this.debug.addButton({ title: 'reset' }).on('click', this.reset)
  }
}
