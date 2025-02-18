import Food from '../life/food'
import Menu from './menu'

export default class MenuFeed extends Menu {
  constructor() {
    super(document.getElementById('menu-feed'))

    const arrows = Array.from(this.element.getElementsByClassName('arrow'))
    this.mealArrow = arrows.at(0)
    this.snackArrow = arrows.at(1)

    this.foodType = Food.MEAL
  }

  cycle() {
    this.mealArrow.classList.toggle('invisible')
    this.snackArrow.classList.toggle('invisible')

    this.foodType = this.foodType === Food.MEAL ? Food.SNACK : Food.MEAL

    this.refreshMenu()
  }

  reset() {
    this.mealArrow.classList.remove('invisible')
    this.snackArrow.classList.add('invisible')
    this.foodType = Food.MEAL
  }

  action() {
    this.life.pet.eat(this.foodType)
  }
}
