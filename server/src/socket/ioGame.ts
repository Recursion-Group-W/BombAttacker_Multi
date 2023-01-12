import { Namespace } from 'socket.io';
import RoomManager from '../manager/roomManager';

export default class IoGame {
  time: Date = new Date();

  constructor(
    public ioNspGame: Namespace,
    public roomManager: RoomManager
  ) {
    ioNspGame.on('connect', async (socket: any) => {
      console.log('クライアントと接続しました');

      //clientIdを生成して送信する処理
      roomManager.generateClientId(socket);

      // //入室
      socket.on(
        'joinRoom',
        async (req: { userName: string }) => {
          console.log(req);
          //入室する処理
          await roomManager.joinRoom(socket, req.userName);
          console.log(`New user connected! to room`);
        }
      );

      // //クライアントから、ゲームの初期状態をリクエストされる
      socket.on('getInitialState', () => {
        //作成されたゲームオブジェクトをjsonに変換する処理

        //クライアントに送るデータを準備
        let payload =
          this.roomManager.roomMap[
            socket.roomId
          ].gameManager.game.getInitialState();
        //クライアントにゲームのデータを送信
        socket.emit('SyncGame', payload);
      });
      // // //ルーム内のユーザーにデータを送信
      // this.roomManager.ioNspGame
      //   .in(this.roomId)
      //   .emit('syncGame', {
      //     nanoSecDiff,
      //     playerArr: Array.from(this.stage.playerSet),
      //     obstacleArr: Array.from(this.stage.obstacleSet),
      //     tankArr: Array.from(this.stage.tankSet),
      //     tankObstacleArr: Array.from(
      //       this.stage.tankobstacleSet
      //     ),
      //     bulletArr: Array.from(this.stage.bulletSet),
      //     botArr: Array.from(this.stage.botSet),
      //   });

      socket.on('movePlayer', (movement: any) => {
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

        console.log(movement);
        this.roomManager.roomMap[
          socket.roomId
        ].gameManager.game.stage.movePlayer(
          socket.clientId,
          movement
        );
      });

      socket.on('moveTank', (objMovement: any) => {
        const tankSet =
          this.roomManager.roomMap[socket.roomId]
            .gameManager.game.stage.tankSet;
        let foundTank = null;
        tankSet.forEach((tank) => {
          if (tank.clientId === socket.clientId) {
            foundTank = tank;
            if (foundTank.iLife === 0) return;
          }
        });
        if (!foundTank) return;

        // console.log(objMovement);
        this.roomManager.roomMap[
          socket.roomId
        ].gameManager.game.stage.moveTank(
          socket.clientId,
          objMovement
        );
      });

      // ショット時の処理の指定
      // ・クライアント側のキー入力時の「socket.emit( 'shoot' );」に対する処理
      socket.on('shoot', () => {
        const tankSet =
          this.roomManager.roomMap[socket.roomId]
            .gameManager.game.stage.tankSet;
        let foundTank = null;
        tankSet.forEach((tank) => {
          if (tank.clientId === socket.clientId) {
            foundTank = tank;
            if (foundTank.iLife === 0) return;
          }
        });
        if (!foundTank) return;

        // ショット
        this.roomManager.roomMap[
          socket.roomId
        ].gameManager.game.stage.createBullet(
          socket.clientId,
          0
        );
      });

      //接続が切れたとき
      socket.on('disconnect', () => {
        console.log('クライアントと接続が切れました');

        //退室する処理
        roomManager.leaveRoom(socket);
      });
    });
  }
}
