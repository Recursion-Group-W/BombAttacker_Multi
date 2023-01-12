import { Namespace } from 'socket.io';

import { v4 as uuidv4 } from 'uuid';
import { ServerConfig } from '../game/config/serverConfig';
import { RoomMap } from '../types/room.type';
import { Users } from '../types/user.type';
import { GameManager } from './gameManager';

export default class RoomManager {
  roomMap: RoomMap = {};

  constructor(public ioNspGame: Namespace) {}

  //clientIdをuuidで作成
  generateClientId(socket: any) {
    let clientId: string = uuidv4();

    socket.clientId = clientId;
    socket.emit('clientId', clientId);
  }

  //入室
  async joinRoom(socket: any, userName: string) {
    socket.roomId = this.chooseRoom();

    // 部屋が存在しなければ、新規作成する
    // ホストidを後で実装
    if (!this.roomMap[socket.roomId]) {
      await this.createRoom(socket.roomId);
    }
    socket.emit('roomId', socket.roomId);

    // socketを使ってユーザを入室させる
    this.addUser(socket);

    let stage =
      this.roomMap[socket.roomId].gameManager.game.stage;

    // プレイヤーを作成
    stage.createPlayer(socket.clientId, userName);
    //タンクを作成
    // stage.createTank(socket.clientId, userName);
  }

  // socketを使ってユーザを入室させる
  addUser(socket: any) {
    let newUsers: Users = {
      [socket.clientId]: {
        clientId: socket.clientId,
        roomId: socket.roomId,
        createdAt: Date.now(),
      },
    };

    //roomMapのroomにユーザーを追加する
    this.roomMap[socket.roomId].users = {
      ...this.roomMap[socket.roomId].users,
      ...newUsers,
    };

    // socketをroomに入れる
    socket.join(socket.roomId);
  }

  //roomIdの対戦ルームを新規作成する
  async createRoom(roomId: string): Promise<void> {
    console.log(
      `対戦ルーム<roomId: ${roomId}>が新規作成されました。`
    );

    //ゲームを作成し、gameManagerにゲームを登録
    let gameManager = new GameManager(roomId, this);

    this.roomMap[roomId] = {
      roomId: roomId,
      users: {},
      gameManager: gameManager,
    };
  }

  // //空いている部屋を探して部屋番号を返す
  chooseRoom(): string {
    const roomIdArr: string[] = Object.keys(this.roomMap);

    //部屋が１つもない場合、部屋番号を新規作成して返す
    if (roomIdArr.length === 0) return uuidv4();

    let chosenRoom: string | null = null;
    for (let roomId in this.roomMap) {
      let room = this.roomMap[roomId];
      //現在入室しているクライアントの数
      const userCount = Object.keys(room.users).length;
      console.log(
        `現在の入室状況: ${userCount} / ${ServerConfig.MAX_PLAYERS_PER_ROOM} 人`
      );
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
    //入室できる部屋がない場合、部屋番号を新規作成して返す
    return uuidv4();
  }

  //退室
  leaveRoom(socket: any) {
    //Roomからクライアントを削除
    this.removeUser(socket.roomId, socket.clientId);

    let stage =
      this.roomMap[socket.roomId].gameManager.game.stage;

    //ステージからプレイヤーを削除
    // stage.destroyTank(socket.clientId);
    stage.destroyPlayer(socket.clientId);
  }

  //roomとroomMapからクライアントを削除
  removeUser(roomId: string, clientId: string) {
    //roomからクライアントを退室させる
    this.ioNspGame.sockets.get(clientId)?.leave(roomId);

    //roomMapからクライアントを削除
    if (this.userExist(roomId, clientId)) {
      delete this.roomMap[roomId].users[clientId];
    }
  }

  //対戦ルームに特定のクライアントが存在するかどうか
  userExist(roomId: string, clientId: string) {
    return (
      this.roomExist(roomId) &&
      this.roomMap[roomId].users &&
      this.roomMap[roomId].users[clientId]
    );
  }

  //roomIdの対戦ルームが存在するかどうか
  roomExist(roomId: string) {
    return this.roomMap && this.roomMap[roomId];
  }
}
