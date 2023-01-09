import { Game } from "../game/game"

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
    game: Game
    users: Users
  }
  export type RoomMap = {
    [roomId: string]: Room
  }