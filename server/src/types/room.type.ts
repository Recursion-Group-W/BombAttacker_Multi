import { GameManager } from "../manager/gameManager";
import { Users } from "./user.type";

export type Room = {
    roomId: string;
    users: Users;
    gameManager: GameManager;
  };
  export type RoomMap = {
    [roomId: string]: Room;
  };