import { Namespace } from 'socket.io';
import { CustomSocket } from './interface/customSocket.interface';
import RoomManager from '../manager/roomManager';
import { Movement } from '../game/types/movement.type';

export default class IoGame {
  time: Date = new Date();

  constructor(
    public ioNspGame: Namespace,
    public roomManager: RoomManager
  ) {
    ioNspGame.on(
      'connect',
      async (socket: CustomSocket) => {
        console.log('クライアントと接続しました');

        //clientIdを生成して送信する処理
        roomManager.generateClientId(socket);

        // 入室
        socket.on(
          'joinRoom',
          async (req: { userName: string }) => {
            // console.log(req);

            //入室する処理
            await roomManager.joinRoom(
              socket,
              req.userName
            );
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
            ].gameManager.game.getInitialState();
          //クライアントにゲームのデータを送信
          socket.emit('syncGame', payload);
        });

        socket.on('movePlayer', (movement: Movement) => {
          if (!socket.roomId || !socket.clientId) return;

          const playerSet =
            this.roomManager.roomMap[socket.roomId]
              .gameManager.game.stage.playerSet;

          let foundPlayer = null;
          playerSet.forEach((player) => {
            if (player.clientId === socket.clientId) {
              foundPlayer = player;
              if (foundPlayer.getLife === 0) return;
            }
          });
          if (!foundPlayer) return;

          this.roomManager.roomMap[
            socket.roomId
          ].gameManager.game.stage.movePlayer(
            socket.clientId,
            movement
          );
        });

        // socket.on('moveTank', (objMovement: any) => {
        //   if (!socket.roomId || !socket.clientId) return;

        //   const tankSet =
        //     this.roomManager.roomMap[socket.roomId]
        //       .gameManager.game.stage.tankSet;
        //   let foundTank = null;
        //   tankSet.forEach((tank) => {
        //     if (tank.clientId === socket.clientId) {
        //       foundTank = tank;
        //       if (foundTank.iLife === 0) return;
        //     }
        //   });
        //   if (!foundTank) return;

        //   // console.log(objMovement);
        //   this.roomManager.roomMap[
        //     socket.roomId
        //   ].gameManager.game.stage.moveTank(
        //     socket.clientId,
        //     objMovement
        //   );
        // });

        //爆弾を設置するリクエストを受け取った時の処理
        socket.on('putBomb', () => {
          if (!socket.roomId || !socket.clientId) return;

          console.log('⚠ 爆弾設置！！！');

          const playerSet =
            this.roomManager.roomMap[socket.roomId]
              .gameManager.game.stage.playerSet;
          let foundPlayer = null;
          playerSet.forEach((player) => {
            if (player.clientId === socket.clientId) {
              foundPlayer = player;
              if (foundPlayer.getLife === 0) return;
            }
          });
          if (!foundPlayer) return;

          // 爆弾を設置
          //createBombメソッドを後で実装する
          // this.roomManager.roomMap[
          //   socket.roomId
          // ].gameManager.game.stage.createBomb(
          //   socket.clientId
          // );
        });

        // ショット時の処理の指定
        // クライアント側のキー入力時の「socket.emit( 'shoot' );」に対する処理
        // socket.on('shoot', () => {
        //   if (!socket.roomId || !socket.clientId) return;

        //   const tankSet =
        //     this.roomManager.roomMap[socket.roomId]
        //       .gameManager.game.stage.tankSet;
        //   let foundTank = null;
        //   tankSet.forEach((tank) => {
        //     if (tank.clientId === socket.clientId) {
        //       foundTank = tank;
        //       if (foundTank.iLife === 0) return;
        //     }
        //   });
        //   if (!foundTank) return;

        //   // ショット
        //   this.roomManager.roomMap[
        //     socket.roomId
        //   ].gameManager.game.stage.createBullet(
        //     socket.clientId,
        //     0
        //   );
        // });

        //接続が切れたとき
        socket.on('disconnect', () => {
          console.log('クライアントと接続が切れました');

          //退室する処理
          roomManager.leaveRoom(socket);
        });
      }
    );
  }
}
