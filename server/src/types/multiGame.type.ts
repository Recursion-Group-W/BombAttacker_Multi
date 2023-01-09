import { GameManager } from "../manager/gameManager"

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
    users: Users
    gameManager: GameManager
  }
  export type RoomMap = {
    [roomId: string]: Room
  }