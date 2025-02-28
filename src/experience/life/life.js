import lifeConfig from '@config/life'
import spritesConfig from '@config/sprites'
import Experience from '@experience'
import Random from '@utils/random'
import { EventDispatcher, Group } from 'three'
import { Pane } from 'tweakpane'
import Food from './food'
import Mess from './mess'
import Misc from './misc'
import Baby from './pet/baby'
import Death from './pet/death'
import Egg from './pet/egg'
import Pet from './pet/pet'
import Senior from './pet/senior'
import Sickness from './sickness'
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

    this.pause = false
    this.tick = state.tick
    this.stats = new Stats(this)

    this.mess = []
    this.sickness = null

    this.group = new Group()
    this.scene.add(this.group)

    if (this.started) this.start()
  }

  start() {
    if (this.started && !this.loading) return

    Food.init()
    Misc.init().sprites.addEventListener('ready', this.initMisc)

    this.started = true
    this.setPet()
  }

  end() {
    this.stage = 'death'
    this.stageStart = this.tick

    this.setPet()
  }

  evolve() {
    const stages = Object.keys(lifeConfig.stages)
    const index = stages.findIndex(s => s == this.stage)
    this.stage = stages.at(index + 1)
    this.stageStart = this.tick

    this.setPet()
  }

  setPet() {
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

    this.pet.addEventListener('ready', this.ready)
    this.loading = false
  }

  ready = () => {
    this.previousPet && this.previousPet.dispose && this.previousPet.dispose()
    this.evolving && this.pet.evolveIn ? this.pet.evolveIn() : this.pet.idle()
    this.petReady = true
  }

  update() {
    this.pet && this.pet.update && this.pet.update()
  }

  updateSeconds() {
    if (!this.petReady || !this.miscReady) return
    if (this.pause) return

    if (this.pet.canEvolve && this.tick >= this.stageEnd) {
      this.pet.evolveOut && this.pet.evolveOut()
      this.evolving = true
    }

    this.tick++
    this.stats.updateSeconds()
    this.saveState()

    this.pet && this.pet.updateSeconds && this.pet.updateSeconds()
  }

  setModel() {
    if (this.loading) return

    const keys = Object.keys(spritesConfig.pets[this.stage])
    const randomModel = Random.fromArray(keys)
    this.model = randomModel
  }

  initMisc = () => {
    this.miscReady = true

    this.initMess()
    this.sickness = new Sickness()
  }

  initMess() {
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
    this.mess.push(new Mess(this.stats.mess - 1))
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
    this.evolving = false

    this.disposeMess()

    this.stats.reset()

    this.start()
    this.dispatchEvent({ type: 'reset' })
    this.saveState()
  }

  show() {
    this.group.visible = true
    this.pause = false
  }

  hide() {
    this.group.visible = false
    this.pause = true
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
    this.debug.addButton({ title: 'reset' }).on('click', this.reset)

    const pane = new Pane({ title: 'ACTIONS' })
    pane.element.parentElement.style.right = '366px'
    pane.addButton({ title: '🍔 eat meal' }).on('click', () => this.pet.eat && this.pet.eat(Food.MEAL)) //prettier-ignore
    pane.addButton({ title: '🍬 eat snack' }).on('click', () => this.pet.eat && this.pet.eat(Food.SNACK)) //prettier-ignore
    pane.addButton({ title: '💩 mess' }).on('click', () => this.pet.mess && this.pet.mess())
    pane.addButton({ title: '🚿 flush' }).on('click', () => this.pet.flush && this.pet.flush())
    pane.addButton({ title: '🚽 toilet' }).on('click', () => this.pet.toilet && this.pet.toilet())
    pane.addButton({ title: '🤒 sick' }).on('click', () => this.pet.sick && this.pet.sick())
    pane.addButton({ title: '☀️ happy' }).on('click', () => this.pet.happy && this.pet.happy())
    pane.addButton({ title: '☁️ upset' }).on('click', () => this.pet.upset && this.pet.upset())
    pane.addButton({ title: '🚫 no' }).on('click', () => this.pet.no && this.pet.no())
    pane.addButton({ title: '💀 kill' }).on('click', () => this.pet.death && this.pet.death())
  }
}
