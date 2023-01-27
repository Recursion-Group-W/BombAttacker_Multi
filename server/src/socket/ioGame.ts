import { Namespace } from 'socket.io';
import { CustomSocket } from './interface/customSocket.interface';
import RoomManager from '../manager/roomManager';
import { Movement } from '../game/types/movement.type';

export default class IoGame {
  time: Date = new Date();

  constructor(public ioNspGame: Namespace, public roomManager: RoomManager) {
    ioNspGame.on('connect', async (socket: CustomSocket) => {
      console.log('クライアントと接続しました');

      //clientIdを生成して送信する処理
      roomManager.generateClientId(socket);

      socket.on('standby', (host: boolean, uid: string) => {
        const roomId = roomManager.standby(socket, host, uid);
        socket.emit('roomId', roomId);
      });

      socket.on('startGame',async (roomId: string, uid: string) => {
        await roomManager.startGame(socket, roomId, uid);
      });

      socket.on('cancelStandby', () => {
        socket.emit('cancelGame');
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

        //退室する処理
        roomManager.leaveRoom(socket);
      });
    });
  }
}
