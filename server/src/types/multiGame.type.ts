import Phaser from "phaser"
import MultiScene from "../game/scene/MultiScene"

export type User = {
    id: string
    clientId: number
    roomId: string
    lastUpdate: number
  }
export type Users = {
    [userId: string]: User
  }
  export type Room  = {
    roomId: string
    game: Phaser.Game
    sceneKey: string
    scene: MultiScene
    users: Users
  }
  export type RoomMap = {
    [roomId: string]: Room
  }