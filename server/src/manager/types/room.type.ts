import { GameManager } from "../gameManager";
import { Users } from "./user.type";

export type Room = {
    // roomId: string;
    users: Users;
    gameManager: GameManager | null;
  };
  export type RoomMap = {
    [roomId: string]: Room;
  };