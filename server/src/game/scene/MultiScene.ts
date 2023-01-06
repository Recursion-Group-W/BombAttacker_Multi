import RoomManager from "../../manager/roomManager"

export default class MultiScene extends Phaser.Scene {
//   id = 0
//   level = 0
//   roomManager: RoomManager
//   roomId: string
//   playerGroup: Phaser.GameObjects.Group
//   map: Map
//   objectsToSync: any = {}
objects: any;

  constructor() {
    super({ key: 'MultiScene'})
  }

//   newId() {
//     return this.id++
//   }

  init() {
    //   const { level,  roomManager ,roomId} = this.registry.get("gameSetting")
    //   this.level = level
    //   this.roomManager = roomManager
    //   this.roomId = roomId
    
  }

  create() {
    // this.playerGroup = this.add.group()
  }

  update() {

  }

//   getInitialState() {
//     let objects: any[] = []
//   }
}