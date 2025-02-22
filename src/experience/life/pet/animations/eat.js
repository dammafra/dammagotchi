import Food from '@life/food'

export default {
  default(type) {
    this.dispose && this.dispose()

    const [idle1] = this.sprites.get('idle')
    idle1.spawn()
    idle1.mesh.position.x = 1

    const [eat1, eat2] = this.sprites.get('eat')
    eat1.spawn()
    eat2.spawn()
    eat1.mesh.visible = false
    eat2.mesh.visible = false
    eat1.mesh.position.x = idle1.mesh.position.x
    eat2.mesh.position.x = idle1.mesh.position.x

    const [food1, food2, food3] = Food.instance.get(type, this.stage)
    food1.spawn()
    food2.spawn()
    food3.spawn()

    food1.mesh.position.y = 1.5
    food1.mesh.position.x = -1
    food2.mesh.position.x =
      food1.mesh.position.x - (this.screen.unit * (food1.width - food2.width)) / 2
    food3.mesh.position.x =
      food1.mesh.position.x - (this.screen.unit * (food1.width - food3.width)) / 2

    food2.mesh.visible = false
    food3.mesh.visible = false

    const startedAt = this.age

    this.updateSeconds = () => {
      if (this.age === startedAt + 1) {
        food1.mesh.position.y = this.screen.center.y
        idle1.mesh.visible = false
        eat2.mesh.visible = true
      }

      if (this.age === startedAt + 2) {
        food1.mesh.visible = false
        food2.mesh.visible = true

        eat2.mesh.visible = false
        eat1.mesh.visible = true
      }

      if (this.age === startedAt + 3) {
        eat1.mesh.visible = false
        eat2.mesh.visible = true
      }

      if (this.age === startedAt + 4) {
        food2.mesh.visible = false
        food3.mesh.visible = true

        eat2.mesh.visible = false
        eat1.mesh.visible = true
      }

      if (this.age === startedAt + 5) {
        eat1.mesh.visible = false
        eat2.mesh.visible = true
      }

      if (this.age === startedAt + 6) {
        food3.mesh.visible = false

        eat2.mesh.visible = false
        eat1.mesh.visible = true
      }

      if (this.age === startedAt + 7) {
        this.idle()
      }
    }

    this.dispose = () => {
      idle1.dispose()

      eat1.dispose()
      eat2.dispose()

      food1.dispose()
      food2.dispose()
      food3.dispose()
    }
  },
}
