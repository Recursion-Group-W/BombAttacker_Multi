import { GameManager } from '../gameManager';
import { Users } from './user.type';

export type Room = {
  // roomId: string;
  users: Users;
  gameManager: GameManager | null;
  playerCount: number;
  allPlayerCount: number;
};
export type RoomMap = {
  [roomId: string]: Room;
};
