import { Scene } from 'phaser';
import { io } from 'socket.io-client';
import { NODE_URL } from '../env';
import { SPRITE_KEY } from '../game/constants';

export default class PreloadScene extends Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {

    this.load.spritesheet(
      SPRITE_KEY.PLAYER.toString(),
      `assets/player_spritesheet_fixed.png`,
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
  }

  create() {
    const url = NODE_URL;
    const socket = io(`${url}/game`);
    socket.on('connect', () => {
      console.log('サーバーとソケット接続しました。');
    });

    socket.on('clientId', (clientId: string) => {
      console.log(`Your clientId is ${clientId}`);
      socket.clientId = clientId;
      this.scene.start('LobbyScene', { socket });
    });
  }
}
