import lifeConfig from '@config/life'
import spritesConfig from '@config/sprites'
import Experience from '@experience'
import Random from '@utils/random'
import { EventDispatcher, Group } from 'three'
import Food from './food'
import Misc from './misc'
import Baby from './pet/baby'
import Death from './pet/death'
import Egg from './pet/egg'
import Mess from './pet/mess'
import Pet from './pet/pet'
import Senior from './pet/senior'
import Stats from './stats'

export default class Life extends EventDispatcher {
  static debugName = '📊 life'

  get stageEnd() {
    const stageDuration = lifeConfig.stages[this.stage]
    return this.stageStart + stageDuration
  }

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
    this.tick = state.tick
    this.stats = new Stats(this)

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
    evolving && this.pet.evolveIn ? this.pet.evolveIn() : this.pet.idle()
  }

  evolve() {
    const stages = Object.keys(lifeConfig.stages)
    const index = stages.findIndex(s => s == this.stage)
    this.stage = stages.at(index + 1)
    this.stageStart = this.tick

    this.setPet(true)
  }

  updateSeconds() {
    if (this.stage === 'death') {
      this.pet.updateSeconds()
      return
    }

    if (this.pause) return

    this.tick === this.stageEnd && this.pet.evolveOut()

    this.tick++
    this.stats.updateSeconds()
    this.saveState()

    if (this.pet && this.pet.updateSeconds) this.pet.updateSeconds()
    this.mess.forEach(m => m.updateSeconds())
  }

  setModel() {
    if (this.loading) return

    const keys = Object.keys(spritesConfig.pets[this.stage])
    const randomModel = Random.fromArray(keys)
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
    this.mess.push(new Mess(this.stats.mess))
    this.stats.mess++
  }

  collideMess(sprite, position) {
    if (!this.stats.mess) return false

    const { rightBound } = sprite.boundsAt(position)
    return this.stats.mess === 1 ? rightBound.x > 1 : rightBound.x > 0
  }

  disposeMess() {
    this.mess.forEach(m => m.dispose())
    this.mess = []
    this.stats.mess = 0
  }

  saveState() {
    const state = {
      started: this.started,
      tick: this.tick,
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
        tick: 0,
        stageStart: 0,
        stage: 'egg',
        model: '',
      }
    }
  }

  reset = () => {
    this.started = false
    this.tick = 0
    this.stageStart = 0
    this.stage = 'egg'
    this.model = ''

    this.disposeMess()

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
    this.debug.addBinding(this, 'tick', { readonly: true })
    this.debug.addBinding(this, 'stageStart', { readonly: true })
    this.debug.addBinding(this, 'stageEnd', { readonly: true })
    this.debug.addBinding(this, 'stage', { readonly: true })
    this.debug.addBinding(this, 'model', { readonly: true })

    this.stats.setDebug(this.debug)

    this.debug
      .addButton({ title: '👉 mess' })
      .on('click', () => !['egg', 'death'].includes(this.stage) && this.pet.mess())
    this.debug.addButton({ title: 'reset' }).on('click', this.reset)
  }
}
