import RoomManager from '../manager/roomManager';
import { Game } from './game';


export const createGame = (roomId: string,roomManager: RoomManager) => {
 return new Game(roomId, roomManager)
}