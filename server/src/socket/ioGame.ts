import { Namespace } from 'socket.io';
import { CustomSocket } from './interface/customSocket.interface';
import RoomManager from '../manager/roomManager';
import { Movement } from '../game/types/movement.type';
import { stopCoverage } from 'v8';
import { GameManager } from '../manager/gameManager';

export default class IoGame {
  time: Date = new Date();
  standby: { [hostId: string]: CustomSocket[] } = {};

  constructor(public ioNspGame: Namespace, public roomManager: RoomManager) {
    ioNspGame.on('connect', async (socket: CustomSocket) => {
      console.log('クライアントと接続しました');

      //clientIdを生成して送信する処理
      roomManager.generateClientId(socket);

      socket.on('standby', (uid: string) => {
        console.log('uid: ' + uid + ' さんが部屋を作成しました');
        if (!this.standby[uid]) this.standby[uid] = [];
        socket.userId = uid;
        this.standby[uid].push(socket);
      });

      socket.on('guestStandby', (uid: string) => {
        if (this.standby[uid]) {
          this.standby[uid].push(socket);
          console.log(uid + 'さんの部屋に参加しました');
        } else {
          socket.emit('noRoom');
        }
      });

      socket.on('makeOver', (uid: string) => {
        console.log(this.standby[uid]);
      });

      socket.on('waitingUser', (uid: string) => {
        socket.emit('waitingUserArr', this.standby[uid].length);
      });

      socket.on('startGame', async (uid: string) => {
        const arr = this.standby[uid];
        const roomId = roomManager.chooseRoom();
        for (let i = 0; i < arr.length; i++) {
          arr[i].roomId = roomId;
          arr[i].userId = arr[i].id;
        }

        if (!roomManager.roomMap[roomId]) {
          await roomManager.createRoom(roomId);
        }
        console.log(`Room<roomId: ${roomId}>を作成しました。`);

        for (let i = 0; i < arr.length; i++) {
          arr[i].emit('join', roomId);
          roomManager.addUser(arr[i]);
          let stage = roomManager.roomMap[roomId].gameManager!.game.stage;
          stage.createPlayer(arr[i], 'userName');
        }
      });

      socket.on('cancelStandby', (uid: string) => {
        console.log('uid: ' + uid + ' さんが部屋を削除しました');
        delete this.standby[uid];
        console.log(this.standby);
      });

      // 入室
      socket.on(
        'joinRoom',
        async (req: { userName: string; userId: string }) => {
          // console.log(req);

          //入室する処理
          await roomManager.joinRoom(socket, req.userName, req.userId);
        }
      );

      // クライアントから、ゲームの初期状態をリクエストされる
      // (ゲームに参加した際の１度だけ)
      socket.on('getInitialState', () => {
        if (!socket.roomId) return;

        //クライアントに送るデータを準備
        let payload =
          this.roomManager.roomMap[
            socket.roomId
          ].gameManager!.game.getInitialState();
        //クライアントにゲームのデータを送信
        socket.emit('syncGame', payload);
      });

      socket.on('movePlayer', (movement: Movement) => {
        if (!socket.roomId || !socket.clientId) return;

        const playerList =
          this.roomManager.roomMap[socket.roomId].gameManager!.game.stage
            .playerList;

        let iterator = playerList.getHead();
        while (iterator !== null) {
          if (iterator.data.clientId === socket.clientId) {
            if (iterator.data.getLife === 0) return;
            else break;
          }
          iterator = iterator.next;
        }
        if (!iterator!.data) return;

        this.roomManager.roomMap[
          socket.roomId
        ].gameManager!.game.stage.movePlayer(socket.clientId, movement);
      });

      //爆弾を設置するリクエストを受け取った時の処理
      socket.on('putBomb', () => {
        if (!socket.roomId || !socket.clientId) return;

        // 爆弾を設置
        this.roomManager.roomMap[
          socket.roomId
        ].gameManager!.game.stage.createBomb(socket.clientId);
      });

      //接続が切れたとき
      socket.on('disconnect', () => {
        console.log('クライアントと接続が切れました');

        // console.log(socket.rooms);
      });

      //退室する処理
      socket.on('leaveRoom', () => {
        roomManager.leaveRoom(socket);
      });
    });
  }
}
