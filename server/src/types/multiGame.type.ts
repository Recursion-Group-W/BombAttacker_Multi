import { GameManager } from '../manager/gameManager';

export type User = {
  clientId: number;
  roomId: string;
  createdAt: number;
};
export type Users = {
  [clientId: string]: User;
};
export type Room = {
  roomId: string;
  users: Users;
  gameManager: GameManager;
};
export type RoomMap = {
  [roomId: string]: Room;
};
