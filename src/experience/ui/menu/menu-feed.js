import Food from '@life/food'
import Menu from './menu'

export default class MenuFeed extends Menu {
  constructor() {
    super()

    this.texture = this.resources.items.menuFeed
    this.hasOptions = true

    this.setGeometry()
    this.setMaterial()
    this.setMesh()

    this.foodType = Food.MEAL
  }

  cycle() {
    super.cycle()
    this.foodType = this.foodType === Food.MEAL ? Food.SNACK : Food.MEAL
  }

  reset() {
    Menu.arrow.position.y = Menu.arrowUpY
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
