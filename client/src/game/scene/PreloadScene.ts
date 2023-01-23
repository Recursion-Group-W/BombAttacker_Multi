import { Scene } from 'phaser';
import { AnimationUtil } from '../util/animation.util';

export class PreloadScene extends Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    //画像の読み込み
    this.load.image('blueBrick', '/assets/blue_brick.png');
    this.load.image('orangeBrick', '/assets/orange_brick.png');
    this.load.image('grayBrick', '/assets/gray_brick.png');
    this.load.image('greenBrick', '/assets/green_brick.png');

    this.load.image('yellowBean', '/assets/bean_yellow.png');
    this.load.image('orangeBean', '/assets/bean_orange.png');
    this.load.image('blueBean', '/assets/bean_blue.png');

    this.load.spritesheet('player', '/assets/brave-spritesheet.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('npc', '/assets/npc-spritesheet.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('bomb', '/assets/bomb.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('explosion', '/assets/explode.png', {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet('yellowEffect', '/assets/effect-yellow.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('orangeEffect', '/assets/effect-orange.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('blueEffect', '/assets/effect-blue.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
  }
  create() {
    //アニメーションを作成
    AnimationUtil.createPlayerAnim(this);
    AnimationUtil.createNpcAnim(this);
    AnimationUtil.createBombAnim(this);
    AnimationUtil.createExplosionAnim(this);
    AnimationUtil.createYellowEffect(this);
    AnimationUtil.createOrangeEffect(this);
    AnimationUtil.createBlueEffect(this);
  }

  update() {
    //MainSceneへ移動
    this.scene.start('MainScene');
  }
}
