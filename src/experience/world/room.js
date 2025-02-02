import { GridHelper, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'
import Experience from '../experience'
import Debug from '../utils/debug'

export default class Room {
  static debugName = '🏠 room'

  constructor() {
    // Setup
    this.experience = Experience.instance
    this.debug = Debug.instance.gui.addFolder(Room.debugName).close()

    this.scene = this.experience.scene
    this.sizes = this.experience.sizes

    this.setFloor()
    this.setBackWall()
    this.setFrontWall()
    this.setLeftWall()
    this.setRightWall()
  }

  setFloor() {
    this.floor = new GridHelper(this.sizes.gridSize, this.sizes.gridSize, '#888888')
    this.scene.add(this.floor)
  }

  setBackWall() {
    this.backWall = new GridHelper(this.sizes.gridSize, this.sizes.gridSize, '#888888')
    this.backWall.rotation.x = -Math.PI * 0.5
    this.backWall.position.z = -this.sizes.gridSize / 2
    this.backWall.position.y = this.sizes.gridSize / 2

    this.scene.add(this.backWall)
  }

  setFrontWall() {
    this.frontWall = new Mesh(
      new PlaneGeometry(this.sizes.gridSize, this.sizes.gridSize),
      new MeshBasicMaterial({ color: 'green' }),
    )
    this.frontWall.visible = false
    this.frontWall.rotation.y = Math.PI
    this.frontWall.position.y = this.sizes.gridSize / 2
    this.frontWall.position.z = -2

    this.scene.add(this.frontWall)

    const frontWallFolder = this.debug.addFolder('front wall')
    frontWallFolder.add(this.frontWall, 'visible')
    frontWallFolder.add(this.frontWall.position, 'z').min(-this.sizes.gridSize).max(this.sizes.gridSize).step(this.sizes.unit).name('positionZ') //prettier-ignore
  }

  setLeftWall() {
    this.leftWall = new Mesh(
      new PlaneGeometry(this.sizes.gridSize, this.sizes.gridSize),
      new MeshBasicMaterial({ color: 'red' }),
    )
    this.leftWall.visible = false
    this.leftWall.rotation.y = Math.PI * 0.625
    this.leftWall.position.x = -0.1
    this.leftWall.position.y = this.sizes.gridSize / 2

    this.scene.add(this.leftWall)

    const leftWallFolder = this.debug.addFolder('left wall')
    leftWallFolder.add(this.leftWall, 'visible')
    leftWallFolder.add(this.leftWall.position, 'x').min(-this.sizes.gridSize).max(this.sizes.gridSize).step(this.sizes.unit).name('positionX') //prettier-ignore
    leftWallFolder.add(this.leftWall.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001).name('rotationY') //prettier-ignore
  }

  setRightWall() {
    this.rightWall = new Mesh(
      new PlaneGeometry(this.sizes.gridSize, this.sizes.gridSize),
      new MeshBasicMaterial({ color: 'red' }),
    )
    this.rightWall.visible = false
    this.rightWall.rotation.y = -Math.PI * 0.625
    this.rightWall.position.x = 0.1
    this.rightWall.position.y = this.sizes.gridSize / 2

    this.scene.add(this.rightWall)

    const rightWallFolder = this.debug.addFolder('right wall')
    rightWallFolder.add(this.rightWall, 'visible')
    rightWallFolder.add(this.rightWall.position, 'x').min(-this.sizes.gridSize).max(this.sizes.gridSize).step(this.sizes.unit).name('positionX') //prettier-ignore
    rightWallFolder.add(this.rightWall.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001).name('rotationY') //prettier-ignore
  }
}
