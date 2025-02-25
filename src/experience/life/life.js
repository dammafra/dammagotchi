import lifeConfig from '@config/life'
import spritesConfig from '@config/sprites'
import Experience from '@experience'
import { EventDispatcher, Group } from 'three'
import Food from './food'
import Misc from './misc'
import Baby from './pet/baby'
import Death from './pet/death'
import Egg from './pet/egg'
import Mess from './pet/mess'
import Pet from './pet/pet'
import Senior from './pet/senior'
import Scheduler from './scheduler'
import Stats from './stats'

export default class Life extends EventDispatcher {
  static debugName = '📊 life'

  constructor() {
    super()

    this.experience = Experience.instance
    this.scene = this.experience.screen.scene

    const state = this.loadState()
    this.started = state.started
    this.stageStart = state.stageStart
    this.stage = state.stage
    this.model = state.model

    this.pause = true
    this.scheduler = new Scheduler()
    this.stats = new Stats(this, this.scheduler)

    this.mess = []

    this.group = new Group()
    this.scene.add(this.group)

    if (this.started) this.start()
  }

  start() {
    if (this.started && !this.loading) return

    Food.init()
    Misc.init().sprites.addEventListener('ready', this.initMess)

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
      this.scheduler.scheduleIn(transitionDuration, this.startStage, `start ${this.stage} stage`)
    } else {
      this.startStage()
    }
  }

  startStage = () => {
    this.pet.idle()

    if (this.stage !== 'death') {
      const stageDuration = lifeConfig.stages[this.stage]
      this.scheduler.scheduleAt(this.stageStart + stageDuration, this.evolveOut, 'evolve out')
    }

    this.experience.screen.setFlicker(false)
  }

  evolveOut = () => {
    this.experience.screen.setFlicker(this.stage !== 'egg' && this.stage !== 'seniors')
    this.dispatchEvent({ type: 'evolve-out' })

    if (this.pet.evolveOut) {
      this.pet.evolveOut()
      const transitionDuration = lifeConfig.transitions[this.stage].out
      this.scheduler.scheduleIn(transitionDuration, this.evolveIn, 'evolve in')
    } else {
      this.evolveIn()
    }
  }

  evolveIn = () => {
    const stages = Object.keys(lifeConfig.stages)
    const index = stages.findIndex(s => s == this.stage)
    this.stage = stages.at(index + 1)
    this.stageStart = this.scheduler.tick

    this.setPet(true)
  }

  updateSeconds() {
    if (!this.pause && this.stage !== 'death') {
      this.scheduler.updateSeconds()
      this.stats.updateSeconds()
      this.saveState()
    }

    if (this.pet && this.pet.updateSeconds) this.pet.updateSeconds()
    this.mess.forEach(m => m.updateSeconds())
  }

  setModel() {
    if (this.loading) return

    const keys = Object.keys(spritesConfig.pets[this.stage])
    const randomModel = keys[Math.floor(Math.random() * keys.length)]
    this.model = randomModel
  }

  checkNeeds() {
    if (!this.stats.hungry) {
      this.dispatchEvent({ type: 'notify' })
      return
    }

    if (!this.stats.happy) {
      this.dispatchEvent({ type: 'notify' })
      return
    }

    this.dispatchEvent({ type: 'resolve' })
  }

  feedMeal() {
    if (this.stats.hungry < 4) {
      this.stats.hungry++
      this.stats.weight++
      this.pet.eat(Food.MEAL)
      this.checkNeeds()
    } else {
      this.pet.no()
    }
  }

  feedSnack() {
    if (this.stats.happy < 4) {
      this.stats.happy++
    }
    this.stats.weight += 2
    this.pet.eat(Food.SNACK)
    this.checkNeeds()
  }

  initMess = () => {
    this.mess = Array(this.stats.mess)
      .fill(true)
      .map((_, index) => new Mess(index))
  }

  showMess() {
    this.mess.forEach(m => m.show())
  }

  hideMess() {
    this.mess.forEach(m => m.hide())
  }

  addMess() {
    if (this.stats.mess < 4) {
      this.mess.push(new Mess(this.stats.mess))
      this.stats.mess++
    }
  }

  disposeMess() {
    this.mess.forEach(m => m.dispose())
    this.mess = []
    this.stats.mess = 0
  }

  saveState() {
    const state = {
      started: this.started,
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
        stageStart: 0,
        stage: 'egg',
        model: '',
      }
    }
  }

  reset = () => {
    this.started = false
    this.stageStart = 0
    this.stage = 'egg'
    this.model = ''

    this.disposeMess()

    this.scheduler.reset()
    this.stats.reset()

    this.start()
    this.dispatchEvent({ type: 'reset' })
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
    this.debug.addBinding(this, 'stageStart', { readonly: true })
    this.debug.addBinding(this, 'stage', { readonly: true })
    this.debug.addBinding(this, 'model', { readonly: true })

    this.stats.setDebug(this.debug)
    this.scheduler.setDebug(this.debug)

    this.debug.addButton({ title: '👉 mess' }).on('click', () => this.pet.mess())
    this.debug.addButton({ title: 'reset' }).on('click', this.reset)
  }
}
