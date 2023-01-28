import { GameManager } from '../gameManager';
import { Users } from './user.type';

export type Room = {
  users: Users;
  gameManager: GameManager | null;
};
export type RoomMap = {
  [roomId: string]: Room;
};
