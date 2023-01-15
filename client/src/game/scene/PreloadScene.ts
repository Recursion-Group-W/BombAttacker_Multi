import { Scene } from 'phaser';
import { AnimationUtil } from '../util/animationUtil';

export class PreloadScene extends Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    this.load.image('blueBrick', '/assets/blue_brick.png');
    this.load.image(
      'orangeBrick',
      '/assets/orange_brick.png'
    );
    this.load.image('grayBrick', '/assets/gray_brick.png');
    this.load.image(
      'greenBrick',
      '/assets/green_brick.png'
    );

    this.load.spritesheet(
      'player',
      '/assets/player_spritesheet_fixed.png',
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    this.load.spritesheet(
      'npc',
      '/assets/enemy_spritesheet_fixed.png',
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    this.load.spritesheet('bomb', '/assets/bomb.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet(
      'explosion',
      '/assets/explode.png',
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
  }
  create() {
    AnimationUtil.createPlayerAnim(this);
    AnimationUtil.createNpcAnim(this);
  }

  update() {
    this.scene.start('MainScene');
  }
}
