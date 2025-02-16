import { EventDispatcher } from 'three'
import { Pane } from 'tweakpane'
import lifeConfig from '../config/life'
import spritesConfig from '../config/sprites'
import Debug from '../utils/debug'
import Food from './food'
import Baby from './pet/baby'
import Death from './pet/death'
import Egg from './pet/egg'
import Pet from './pet/pet'
import Senior from './pet/senior'

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

    // TODO: load saved state
    this.age = 0
    this.stageStart = 0
    this.pause = false
    this.scheduled = new Map()

    this.stage = 'egg'
    this.model = ''

    this.setPet()
    this.setActionsPane()

    this.debug = Debug.instance.gui?.addFolder({ title: Life.debugName })
    this.debug?.addBinding(this, 'pause')
    this.debug?.addBinding(this, 'stage', { readonly: true })
    this.debug?.addBinding(this, 'stageStart', { readonly: true })
    this.debug?.addBinding(this, 'model', { readonly: true })
    this.debug?.addBinding(this, 'age', { readonly: true })
    this.debug?.addBinding(this, 'scheduledFormatted', {
      label: 'schedule',
      readonly: true,
      multiline: true,
      rows: 5,
    })
  }

  setPet(evolving) {
    this.previousPet = this.pet

    switch (this.stage) {
      case 'egg':
        this.model = ''
        this.pet = new Egg()
        break

      case 'babies':
        this.model = this.getRandomModel()
        this.pet = new Baby(this.model)
        break

      case 'seniors':
        this.model = this.getRandomModel()
        this.pet = new Senior(this.model)
        break

      case 'death':
        this.model = ''
        this.pet = new Death()
        break

      default:
        this.model = this.getRandomModel()
        this.pet = new Pet(this.stage, this.model)
        break
    }

    this.pet.addEventListener('ready', () => this.ready(evolving))
  }

  ready = evolving => {
    this.previousPet && this.previousPet.dispose()

    if (evolving && this.pet.evolveIn) {
      this.pet.evolveIn()
      const transitionDuration = lifeConfig.transitions[this.stage].in
      this.schedule(this.startStage, transitionDuration, `start ${this.stage} stage`)
    } else {
      this.startStage()
    }

    this.dispatchEvent({ type: 'ready' })
  }

  startStage = () => {
    this.pet.idle()

    this.stageStart = this.age
    const stageDuration = lifeConfig.stages[this.stage]
    if (stageDuration > 0) this.schedule(this.evolveOut, stageDuration, 'evolve out')
  }

  evolveOut = () => {
    if (this.pet.evolveOut) {
      this.pet.evolveOut()
      const transitionDuration = lifeConfig.transitions[this.stage].out
      this.schedule(this.evolveIn, transitionDuration, 'evolve in')
    } else {
      this.next()
    }
  }

  evolveIn = () => {
    const stages = Object.keys(lifeConfig.stages)
    const index = stages.findIndex(s => s == this.stage)
    this.stage = stages.at(index + 1)

    this.setPet(true)
  }

  updateSeconds() {
    if (!this.pause && this.stage !== 'death') this.age++
    this.checkScheduled()
    if (this.pet && this.pet.updateSeconds) this.pet.updateSeconds()
  }

  schedule(action, offset, label) {
    this.scheduled.set(this.age + offset, { label, action })
  }

  checkScheduled() {
    for (const key of this.scheduled.keys()) {
      if (this.age >= key) {
        this.scheduled.get(key).action()
        this.scheduled.delete(key)
      }
    }
  }

  getRandomModel() {
    const keys = Object.keys(spritesConfig.pets[this.stage])
    return keys[Math.floor(Math.random() * keys.length)]
  }

  setActionsPane() {
    const actionsPane = new Pane({ title: 'ACTIONS' })
    actionsPane.element.parentElement.style.bottom = '96px'
    actionsPane.element.parentElement.style.top = 'unset'

    actionsPane.addButton({ title: '🍔 eat meal' }).on('click', () => this.pet.eat && this.pet.eat(Food.MEAL)) //prettier-ignore
    actionsPane.addButton({ title: '🍬 eat snack' }).on('click', () => this.pet.eat && this.pet.eat(Food.SNACK)) //prettier-ignore
  }
}
