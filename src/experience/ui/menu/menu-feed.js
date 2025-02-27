import Food from '@life/food'
import Menu from './menu'

export default class MenuFeed extends Menu {
  constructor() {
    super(document.getElementById('menu-feed'))

    this.hasOptions = true

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
    this.foodType === Food.MEAL ? this.feedMeal() : this.feedSnack()
    this.hide()
  }

  feedMeal() {
    if (this.life.stats.hungry < 4 && !this.life.stats.bad) {
      this.life.stats.hungry++
      this.life.stats.weight++
      this.life.pet.eat(Food.MEAL)
    } else {
      this.life.pet.no()
    }
  }

  feedSnack() {
    if (this.life.stats.happy < 4) {
      this.life.stats.happy++
    }
    this.life.stats.weight += 2
    this.life.pet.eat(Food.SNACK)
  }
}
