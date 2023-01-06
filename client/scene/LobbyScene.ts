import { Scene } from 'phaser';
import { Socket } from 'socket.io-client';

export default class LobbyScene extends Scene {
  socket: Socket;
  constructor() {
    super({ key: 'LobbyScene' });
  }

  init(props: { socket: Socket }) {
    const { socket } = props;
    this.socket = socket;
  }

  create() {
    const styles = {
      color: '#000000',
      align: 'center',
      fontSize: 40,
    };

    let texts: any[] = [];

    texts.push(
      this.add
        .text(500, 100, '【LOBBY】', styles)
        .setOrigin(0.5, 0)
        .setInteractive()
    );
    texts.push(
      this.add
        .text(
          500,
          200,
          `Your clientId is 
          ${this.socket.clientId}`,
          styles
        )
        .setOrigin(0.5, 0)
        .setInteractive()
    );

    texts.push(
      this.add
        .text(500, 350, `→ Single Play Mode `, styles)
        .setOrigin(0.5, 0)
        .setInteractive()
    );

    texts.push(
      this.add
        .text(500, 550, `→ Join the Online Room!`, styles)
        .setOrigin(0.5, 0)
        .setInteractive()
        .on('pointerdown', () => {
          this.scene.start('MultiScene', {
            scene: 'MultiScene',
            level: 0,
            socket: this.socket,
          });
        })
    );
  }
}
