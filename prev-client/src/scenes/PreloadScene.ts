export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    this.load.image('tileset', '/assets/tileset.png');
    this.load.tilemapTiledJSON(
      'stage1',
      '/assets/stage1.json'
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
      'enemy',
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
      'explode',
      '/assets/explode.png',
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
  }

  update() {
    this.scene.start('GameScene', { stageLevel: 1 });
  }
}
