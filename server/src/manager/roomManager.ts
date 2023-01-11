import { Namespace } from 'socket.io';

import { v4 as uuidv4 } from 'uuid';
import { createGame } from '../game/createGame';
import { Game } from '../game/game';
import { ServerConfig } from '../game/serverConfig';
import { RoomMap, Users } from '../types/multiGame.type';
import { GameManager } from './gameManager';

export default class RoomManager {
  roomMap: RoomMap = {};

  constructor(public ioNspGame: Namespace) {}

  generateClientId(socket: any) {
    let clientId: string = uuidv4();

    socket.clientId = clientId;
    socket.emit('clientId', clientId);
  }

  async joinRoom(socket: any, userName: string) {
    socket.roomId = this.chooseRoom();

    // 部屋が存在しなければ、新規作成する
    if (!this.roomMap[socket.roomId]) {
      await this.createRoom(socket.roomId);
    }
    socket.emit('roomId', socket.roomId);

    // socket.clientIdを使ってユーザを入室させる
    this.addUser(socket);

    let stage =
      this.roomMap[socket.roomId].gameManager.game.stage;
    // まだゲーム開始前。プレイしていない通信のソケットIDリストに追加
    // stage.setNotPlayingSocketID.add(socket.id);

    // createPlayer()
    //タンクを作成
    stage.createTank(socket.clientId, socket.id, userName);

    console.log('socketID: ', socket.id);
    console.log('clientId: ', socket.clientId);
  }
  addUser(socket: any) {
    let newUsers: Users = {
      [socket.id]: {
        roomId: socket.roomId,
        lastUpdate: Date.now(),
        clientId: socket.clientId,
        id: socket.id,
      },
    };

    this.roomMap[socket.roomId].users = {
      ...this.roomMap[socket.roomId].users,
      ...newUsers,
    };
    // join the socket room
    socket.join(socket.roomId);
  }

  async createRoom(roomId: string): Promise<void> {
    console.log(
      `対戦ルーム<roomId: ${roomId}>が新規作成されました。`
    );

    let game: Game = createGame(roomId, this);
    let gameManager = new GameManager(game);

    this.roomMap[roomId] = {
      roomId: roomId,
      users: {},
      gameManager: gameManager,
    };
  }

  // //空いている部屋を探して部屋番号を返す
  chooseRoom(): string {
    const roomIdArr: string[] = Object.keys(this.roomMap);

    //部屋がない場合、新規作成する
    if (roomIdArr.length === 0) return uuidv4();

    let chosenRoom: string | null = null;
    for (let roomId in this.roomMap) {
      let room = this.roomMap[roomId];
      const userCount = Object.keys(room.users).length;
      console.log('usercount: ', userCount);
      //対戦ルームが満員でない、かつステージレベルが１の場合に入室できる
      if (
        userCount < ServerConfig.MAX_PLAYERS_PER_ROOM &&
        room.gameManager.game.stage.level === 1
      ) {
        chosenRoom = roomId;
        break;
      }
    }
    if (chosenRoom) return chosenRoom;
    return uuidv4();
  }

  leaveRoom(socket: any) {
    this.removeUser(socket.room, socket.id);

    let stage =
      this.roomMap[socket.roomId].gameManager.game.stage;

    // プレイしていない通信のソケットIDリストから削除
    // stage.setNotPlayingSocketID.delete(socket.id);

    stage.destroyTank(socket.clientId);
  }

  removeUser(roomId: string, socketId: string) {
    if (this.ioNspGame.sockets.get(socketId)) {
      this.ioNspGame.sockets.get(socketId)?.leave(roomId);
    }

    if (this.userExists(roomId, socketId)) {
      delete this.roomMap[roomId].users[socketId];

      return true;
    }
    return false;
  }

  userExists(roomId: string, socketId: string) {
    if (
      this.roomExists(roomId) &&
      this.roomMap[roomId].users &&
      this.roomMap[roomId].users[socketId]
    )
      return true;
    return false;
  }

  roomExists(roomId: string) {
    if (this.roomMap && this.roomMap[roomId]) return true;
    return false;
  }
}
