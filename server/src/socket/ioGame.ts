import { Namespace } from 'socket.io';
import RoomManager from '../manager/roomManager';

export default class IoGame {
  time: Date = new Date();

  constructor(public ioNspGame: Namespace, public roomManager: RoomManager) {
    ioNspGame.on('connect', async (socket: any) => {
      console.log('クライアントと接続しました');

      //clientIdを生成して送信する処理
      roomManager.generateClientId(socket)


      // //入室
      socket.on(
        'joinRoom',
        async (data: { scene: string }) => {
          const { scene } = data;
          //入室する処理
          await roomManager.joinRoom(socket, scene)
          console.log(`New user connected! to room`);
          console.log(`scene is ${scene}`)
          //ゲームを新規作成する処理
        }
      );

      // //クライアントから、ゲームの初期状態をリクエストされる
      // socket.on('getInitialState', () => {
      //   //作成されたゲームオブジェクトをjsonに変換する処理

      //   //クライアントに送るデータを準備
      //   let payload = {
      //     time: this.time,
      //     roomId: 0,
      //     objects: null, // ゲームオブジェクト(Arcadeオブジェクトをjsonに変換したもの)
      //     connectCounter: 0, //入室しているクライアントの人数
      //   };
      //   //クライアントにゲームのデータを送信
      //   socket.emit('SyncGame', payload);
      // });

      //接続が切れたとき
      socket.on('disconnect', () => {
        //退室する処理

        console.log('クライアントと接続が切れました');
      });
    });
  }
}
