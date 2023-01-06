import { Scene } from 'phaser';
import { Enemy } from '../models/enemy';
import { Player } from '../models/player';
import { View } from '../view/view';

export class GameScene extends Scene {
  private width: number; //描画範囲(width)
  private height: number; //描画範囲(width)
  private player: Player; //プレイヤー
  private enemies: Phaser.GameObjects.Group; //敵キャラのグループ
  // note:mapはcurrentMapとそれ以外みたいな保持の仕方もあり？
  private map: Phaser.Tilemaps.Tilemap; //タイルマップ（ステージ）
  private timer: number;
  private level: number; //ステージレベル
  private isGameOver: boolean;
  private isGameClear: boolean;
  // 絵柄のデザインをこだわるならidで判別するよりstring型が良い？exモナリザ、洞窟
  private stageName: string;
  private scoreText: Phaser.GameObjects.Text;
  private stockText: Phaser.GameObjects.Text;
  private gameOverText: Phaser.GameObjects.Text;
  private bombs: Phaser.GameObjects.Group;
  private bombLog: {
    x: number;
    y: number;
    existed: boolean;
  };
  private explosion: Phaser.GameObjects.Group;
  private enemyCounter: number;

  gameState;

  constructor() {
    super({ key: 'GameScene' });
    this.bombLog = {
      x: -1,
      y: -1,
      existed: false,
    };
    this.timer = 0;
    this.isGameOver = false;
    this.isGameClear = false;
    this.stageName = 'first';
    this.enemyCounter = 0;
  }

  // getter,setter
  public get getWidth(): number {
    return this.width;
  }

  public set setWidth(newWidth: number) {
    this.width = newWidth;
  }

  public get getHeight(): number {
    return this.height;
  }

  public set setHeight(newHeight: number) {
    this.height = newHeight;
  }

  public get getIsGameOver(): boolean {
    return this.isGameOver;
  }

  public set setIsGameOver(gameStatus: boolean) {
    this.isGameOver = gameStatus;
  }

  public get getIsGameClear(): boolean {
    return this.isGameClear;
  }

  public set setIsGameClear(gameStatus: boolean) {
    this.isGameClear = gameStatus;
  }

  public get getStageName(): string {
    return this.stageName;
  }

  public set setStageName(nextStage: string) {
    this.stageName = nextStage;
  }

  public defeateEnemy() {
    this.enemyCounter--;
  }

  //init, preload, create, updateはSceneに用意されているメソッドなので、オーバーライドする
  init(data: { stageLevel: number }) {
    this.level = data.stageLevel;
  }

  preload() {
    const width: string | number =
      this.scene.systems.game.config['width'];
    const height: string | number =
      this.scene.systems.game.config['height'];

    this.width =
      typeof width === 'string' ? parseInt(width) : width;
    this.height =
      typeof height === 'string'
        ? parseInt(height)
        : height;
  }

  create() {
    this.gameState = this.registry.get('gameState');
    
    this.game.events.emit(
      'setPlayerName',
      'Recursion-Group-W',
      0
    );

    this.map = this.make.tilemap({
      key: `stage${this.level}`,
    });
    const tiles = this.map.addTilesetImage(
      'tileset',
      'tileset'
    );

    const groundLayer = this.map.createLayer(
      'ground',
      tiles,
      0,
      0
    );
    const wallLayer = this.map.createLayer(
      'wall',
      tiles,
      0,
      0
    );
    const blockLayer = this.map.createLayer(
      'blocks',
      tiles,
      0,
      0
    );
    this.bombs = this.physics.add.staticGroup();
    this.explosion = this.physics.add.group();

    //ステージマップの衝突を有効にする
    groundLayer.setCollisionByExclusion([-1], true);
    wallLayer.setCollisionByExclusion([-1], true);
    blockLayer.setCollisionByExclusion([-1], true);

    //ステージマップの境界を設定
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;
    //ステージマップの衝突を有効にする。(left, right, up, down)
    this.physics.world.setBoundsCollision(
      true,
      true,
      true,
      true
    );

    //キー操作のアニメーション実行
    this.initAnimation();

    //敵キャラたち
    this.enemies = this.add.group();

    const objectLayer = this.map.getObjectLayer('objects');
    objectLayer.objects.forEach((object) => {
      if (object.name === 'player') {
        this.player = new Player(
          {
            scene: this,
            x: object.x + 0,
            y: object.y + 0,
          },
          3
        );
      }
    });

    for (let i = 1; i < 2; i++) {
      for (let j = 1; j < 2; j++) {
        if (i === 0 && j === 0) continue;
        this.enemies.add(
          new Enemy(
            { scene: this, x: 100 * i, y: 100 * j },
            1
          )
        );
        this.enemyCounter++;
      }
    }

    // 残機
    this.stockText = this.add.text(
      16,
      0,
      `Stock ${this.player.getLives}`,
      {
        fontSize: '32px',
      }
    );

    // ゲームオーバー表示を追加する
    this.gameOverText = this.add.text(400, 300, '', {
      fontSize: '64px',
    });
    this.gameOverText.setOrigin(0.5);

    //衝突を設定
    // overlapはすり抜ける（爆弾,アイテム取得など）
    // colliderはすり抜けずに衝突する
    this.physics.add.collider(wallLayer, this.player);
    this.physics.add.collider(blockLayer, this.player);
    this.physics.add.collider(wallLayer, this.enemies);
    this.physics.add.collider(blockLayer, this.enemies);
    this.physics.add.collider(this.bombs, this.player);
    this.physics.add.collider(this.bombs, this.enemies);
    this.physics.add.collider(
      this.enemies,
      this.player,
      (
        enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody
      ) => {
        let lives = 0;
        //衝突した時の処理
        if (!this.player.getHit) {
          this.player.setTintFill(0xff0000);
          lives = this.player.reduceLife();
          this.player.setHit = true;
          this.stockText.setText('Stock ' + lives);
          if (lives <= 0) {
            this.player.disableBody();
            this.gameOverText.setText('GAME OVER');
            setTimeout(() => this.scene.restart(), 1000);
          }
        }
        enemy.collideWithPlayer();
        setTimeout(()=>{
          this.player.clearTint();
          this.player.setHit = false;
        },1000);
      },
      null,
      this
    );
    this.physics.add.collider(
      this.player,
      this.explosion,
      () => {
        let lives = 0;
        if (!this.player.getHit) {
          lives = this.player.reduceLife();
          this.stockText.setText('Stock ' + lives);
          if (lives <= 0) {
            this.player.disableBody();
            this.gameOverText.setText('GAME OVER');
            setTimeout(() => this.scene.restart(), 1000);
          }
        }
        this.player.setHit = true;
      },
      null,
      this
    );
    this.physics.add.collider(
      this.enemies,
      this.explosion,
      (
        enemy: Phaser.Types.Physics.Arcade.GameObjectWithBody
      ) => {
        let lives = 0;
        if (!enemy.getHit) {
          lives = enemy.reduceLife();
          if (lives <= 0) {
            enemy.destroy();
            this.enemyCounter--;
          }
        }
        if (this.enemyCounter <= 0) {
          this.gameOverText.setText('GAME CLEAR');
          setTimeout(() => this.scene.restart(), 1000);
        }
        enemy.setHit = true;
      },
      null,
      this
    );
  }

  update() {
    //キー入力によってプレイヤーの位置を更新
    this.player.update();

    let bomb: any;
    if (this.player.placingBomb()) {
      if (
        this.bombLog.x != this.player.x ||
        this.bombLog.y != this.player.y ||
        !this.bombLog.existed
      ) {
        bomb = this.bombs.create(
          this.player.x,
          this.player.y,
          'bomb'
        );
        this.bombLog.existed = true;
        this.player.decreaseBombCounter();
        bomb.anims.play('bomb-anime', true);

        setTimeout(() => {
          this.bombLog.x = bomb.x;
          this.bombLog.y = bomb.y;
          bomb.destroy();

          this.explosion.create(bomb.x, bomb.y, 'explode');
          this.explosion.create(
            bomb.x + 32,
            bomb.y,
            'explode'
          );
          this.explosion.create(
            bomb.x,
            bomb.y + 32,
            'explode'
          );
          this.explosion.create(
            bomb.x - 32,
            bomb.y,
            'explode'
          );
          this.explosion.create(
            bomb.x,
            bomb.y - 32,
            'explode'
          );
          this.explosion.playAnimation('explode-anime');

          this.bombLog.existed = false;
          this.player.increaseBombCounter();
          setTimeout(() => {
            this.explosion.clear(true, true);
            this.player.setHit = false;
          }, 600);
        }, 2000);
      }
    }
    //敵の位置を更新
    this.enemies.getChildren().forEach((e) => e.update());
  }

  //アニメーション設定
  initAnimation() {
    //アニメーションマネージャー
    this.anims.create({
      key: 'player-right',
      frameRate: 10,
      repeat: 0,
      frames: this.anims.generateFrameNumbers('player', {
        start: 5,
        end: 7,
      }),
    });
    this.anims.create({
      key: 'player-turn-right',
      frameRate: 10,
      repeat: 0,
      frames: [{ key: 'player', frame: 4 }],
    });
    this.anims.create({
      key: 'player-down',
      frameRate: 10,
      repeat: 0,
      frames: this.anims.generateFrameNumbers('player', {
        start: 2,
        end: 3,
      }),
    });
    this.anims.create({
      key: 'player-turn-down',
      frameRate: 10,
      repeat: 0,
      frames: [{ key: 'player', frame: 1 }],
    });
    this.anims.create({
      key: 'player-up',
      frameRate: 10,
      repeat: 0,
      frames: this.anims.generateFrameNumbers('player', {
        start: 8,
        end: 9,
      }),
    });
    this.anims.create({
      key: 'player-turn-up',
      frameRate: 10,
      repeat: 0,
      frames: [{ key: 'player', frame: 0 }],
    });

    this.anims.create({
      key: 'enemy-right',
      frameRate: 10,
      repeat: -1,
      frames: this.anims.generateFrameNumbers('enemy', {
        start: 5,
        end: 7,
      }),
    });
    this.anims.create({
      key: 'enemy-turn-right',
      frameRate: 10,
      repeat: 0,
      frames: [{ key: 'player', frame: 4 }],
    });
    this.anims.create({
      key: 'enemy-down',
      frameRate: 10,
      repeat: -1,
      frames: this.anims.generateFrameNumbers('enemy', {
        start: 2,
        end: 3,
      }),
    });
    this.anims.create({
      key: 'enemy-turn-down',
      frameRate: 10,
      repeat: 0,
      frames: [{ key: 'enemy', frame: 1 }],
    });
    this.anims.create({
      key: 'enemy-up',
      frameRate: 10,
      repeat: -1,
      frames: this.anims.generateFrameNumbers('enemy', {
        start: 8,
        end: 9,
      }),
    });
    this.anims.create({
      key: 'enemy-turn-up',
      frameRate: 10,
      repeat: 0,
      frames: [{ key: 'enemy', frame: 0 }],
    });
    this.anims.create({
      key: 'bomb-anime',
      frameRate: 10,
      repeat: 2,
      frames: this.anims.generateFrameNumbers('bomb', {
        start: 0,
        end: 7,
      }),
    });
    this.anims.create({
      key: 'explode-anime',
      frameRate: 20,
      repeat: 0,
      frames: this.anims.generateFrameNumbers('explode', {
        start: 0,
        end: 9,
      }),
    });
  }

  private activateGameOverScreen(): void {
    if (
      this.player.getLives <= 0 &&
      !this.isGameOver
    ) {
      View.renderGameOverPage();
    }
  }

  private activateGameClear(): void {
    // if (ゲームクリアの条件);
    if (this.stageName == 'second')
      this.setIsGameClear = true;
  }

  private changeStage(nextStage: string): void {
    if (this.isGameClear) {
      this.setStageName = nextStage;
      this.activateNewScreen();
    }
  }

  private activateNewScreen(): void {
    switch (this.stageName) {
      case 'first':
        View.renderFirstStagePage();
        break;
      case 'second':
        View.renderSecondStagePage();
        break;
    }
  }

  private set setPlayerColor(color: string) {
    // idをkey、colorをvalueにして色を配る？
  }
}
