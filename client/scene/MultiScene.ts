import { Scene } from 'phaser';
import { Socket } from 'socket.io-client';

export default class MultiScene extends Scene {
  socket: Socket;

  constructor() {
    super({ key: 'MultiScene' });
  }

  init(props: { scene: string; socket: Socket }) {
    const { scene, socket } = props;
    this.socket = socket;
    //入室の処理
    this.socket.emit('joinRoom', { scene });
  }

  create() {
    const socket = this.socket;

    const styles = {
      color: '#000000',
      align: 'center',
      fontSize: 40,
    };

    let texts: any[] = [];
    texts.push(
      this.add
        .text(500, 150, `【対戦ルーム】`, styles)
        .setOrigin(0.5, 0)
        .setInteractive()
    );

    // texts.push(
    //   this.add
    //     .text(
    //       500,
    //       300,
    //       `入室成功!! `,
    //       styles
    //     )
    //     .setOrigin(0.5, 0)
    //     .setInteractive()
    // );

    //初期状態を取得したいということをサーバーに伝える
    // socket.emit('getInitialState');

    //サーバーからゲームデータを受け取る
    // socket.on('SyncGame', (res: any) => {
    //   console.log(res);
    // });
  }
}
