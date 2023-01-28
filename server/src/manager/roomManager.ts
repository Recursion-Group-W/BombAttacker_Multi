import { Namespace } from 'socket.io';

import { v4 as uuidv4 } from 'uuid';
import { ServerConfig } from '../game/config/serverConfig';
import { CustomSocket } from '../socket/interface/customSocket.interface';
import { RoomMap } from './types/room.type';
import { User } from './types/user.type';
import { GameManager } from './gameManager';


export default class RoomManager {
  roomMap: RoomMap = {};
  playerCount = 0;
  allPlayerCount = 0;

  constructor(public ioNspGame: Namespace) {}
  generateClientId(socket: CustomSocket) {
    let clientId: string = uuidv4();
    socket.clientId = clientId;
    socket.emit('clientId', clientId);
  } 

  standby(socket: CustomSocket, host: boolean, uid: string) {
    
  }
  
  async startGame(socket: CustomSocket, roomId: string, uid : string) {
    socket.roomId = roomId;
    socket.userId = uid;

    const gameManager = new GameManager(roomId, this);
    this.roomMap[roomId].gameManager = gameManager;
    socket.emit('join', socket.roomId);

    this.addUser(socket);
    let stage = gameManager.game.stage;
    // プレイヤーを作成
    stage.createPlayer(socket, 'userName');
  }

  //入室
  async joinRoom(socket: CustomSocket, userName: string, userId = localStorage.getItem("userId")!.toString()) {
    if (!socket.clientId) return;

    socket.userId = userId;
    socket.roomId = this.chooseRoom();
    this.playerCount += 1;
    this.allPlayerCount += 1;
    // 部屋が存在しなければ、新規作成する
    // ホストidを後で実装
    if (!this.roomMap[socket.roomId]) {
      await this.createRoom(socket.roomId);
    }
    socket.emit('join', socket.roomId);
    console.log(`Room<roomId: ${socket.roomId}>を作成しました。`);
    // socketを使ってユーザを入室させる
    this.addUser(socket);

    console.log(`ユーザー<clientId: ${socket.clientId}>が入室しました。`);

    let stage = this.roomMap[socket.roomId].gameManager!.game.stage;

    // プレイヤーを作成
    stage.createPlayer(socket, userName);
    
  }

  // socketを使ってユーザを入室させる
  addUser(socket: CustomSocket) {
    if (!(socket.roomId && socket.clientId && socket.userId)) return;

    const newUser: User = {
      clientId: socket.clientId,
      userId: socket.userId,
      roomId: socket.roomId,
      createdAt: Date.now(),
    };

    //roomMapのroomにユーザーを追加する
    this.roomMap[socket.roomId].users = {
      ...this.roomMap[socket.roomId].users,
      [socket.clientId]: newUser,
    };

    // socketをroomに入れる
    socket.join(socket.roomId);
  }

  //roomIdの対戦ルームを新規作成する
  async createRoom(roomId: string): Promise<void> {
    console.log(`対戦ルーム<roomId: ${roomId}>が新規作成されました。`);

    //ゲームを作成し、gameManagerにゲームを登録
    let gameManager = new GameManager(roomId, this);

    this.roomMap[roomId] = {
      // roomId: roomId,
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
        room.gameManager!.game.stage.level === 1
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
  leaveRoom(socket: CustomSocket) {
    if (!(socket.roomId && socket.clientId)) return;
    //Roomからクライアントを削除
    this.removeUser(socket.roomId, socket);
    let stage = this.roomMap[socket.roomId].gameManager!.game.stage;
    //ステージからプレイヤーを削除
    stage.destroyPlayer(socket.clientId);
    this.playerCount -= 1;
    socket.emit('playerLeave', this.playerCount, this.allPlayerCount);
    //部屋に誰もいなくなった場合、部屋を削除
    let room = this.roomMap[socket.roomId];
    if (Object.keys(room.users).length <= 0) {
      this.removeRoom(socket.roomId);
    }
  }

  //roomとroomMapからクライアントを削除
  removeUser(roomId: string, socket: CustomSocket) {
    //roomからクライアントを退室させる
    // this.ioNspGame.sockets.get(socket.id)?.leave(roomId);

    if (socket.clientId)
      if (this.userExist(roomId, socket.clientId)) {
        //roomMapからクライアントを削除
        delete this.roomMap[roomId].users[socket.clientId];
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

  //部屋を削除する
  removeRoom(roomId: string) {
    if (!this.roomExist(roomId)) return;

    delete this.roomMap[roomId];
  }
}
