import { getRandomInt } from '../utils/enemy.util';
import { Character } from './character';
import { Player } from './player';

export class Enemy extends Character {
  private mode = 'complicated';

  constructor(
    params: {
      scene: Phaser.Scene;
      x: number;
      y: number;
    },
    lives: number
  ) {
    super(params, 'enemy', lives);
    this.setSpeed = 80;

    //Arcade Physicsをゲームオブジェクトに追加
    params.scene.physics.world.enable(this);
    //Sceneにゲームオブジェクトを追加
    params.scene.add.existing(this);

    //最初に動く方向をランダムにセット
    this.setDirection = getRandomInt(0, 4);
  }

  //GameObjectによってオーバーライドされる更新メソッド
  //このメソッドが何度も呼び出されるため、
  //この中にオブジェクトの位置や速度を変化させる記述を書いておくと、動きを付けられる
  update() {
    // this.moveRamdom();
  }

  //ランダムな動き
  moveRamdom() {
    if (this.isMoving()) return;

    if (this.body.velocity.x + this.body.velocity.y === 0) {
      //4方向をランダムに選択して動かす
      const randomDir: number = getRandomInt(0, 3);
      this.moveByDirection(randomDir);
    }
  }

  //XかYのどちらかの単調な動き
  moveMonotone() {
    if (this.isMoving()) return;

    if (this.body.velocity.x + this.body.velocity.y === 0) {
      //XかYのどちらかの方向をランダムに選択して動かす
      const randomDir: number = getRandomInt(0, 1);
      switch (randomDir) {
        case 0:
          this.moveMonoX();
          break;
        case 1:
          this.moveMonoY();
          break;
      }
    }
  }

  //プレイヤーと衝突した時、反対方向に向きを変える
  collideWithPlayer() {
    const opposite = this.getOppositeDirection(
      this.getDirection
    );
    this.moveByDirection(opposite);
  }

  //追跡する動き
  chasePlayer(player: Player) {}

  //X方向の単調な動き
  private moveMonoX() {
    //動いている(障害物にぶつかっていない) → 何もしない
    if (this.isMoving()) return;

    //移動速度を0に更新
    this.setVelocityY(0);

    //速度が0(障害物にぶつかったorゲームスタート時) → 方向転換する
    if (this.body.velocity.x === 0) {
      const opposite = this.getOppositeDirection(
        this.getDirection
      );
      this.moveByDirection(opposite);
    }
  }

  //Y方向の単調な動き
  private moveMonoY() {
    //動いている(障害物にぶつかっていない) → 何もしない
    if (this.isMoving()) return;

    //移動速度を0に更新
    this.setVelocityX(0);

    //速度が0(障害物にぶつかったorゲームスタート時) → 方向転換する
    if (this.body.velocity.y === 0) {
      const opposite = this.getOppositeDirection(
        this.getDirection
      );
      this.moveByDirection(opposite);
    }
  }

  //動いているかどうか
  private isMoving(): boolean {
    return (
      this.body.velocity.x + this.body.velocity.y !== 0
    );
  }

  //direction(方向)を受け取って、反対方向のdirectionを返すメソッド
  private getOppositeDirection(direction: number) {
    const hashmap: { [key: number]: number } = {
      //up(0) : down(2)
      0: 2,
      1: 3,
      2: 0,
      3: 1,
    };
    return hashmap[direction];
  }

  //direction(方向)を受け取って、その方向に動かすメソッド
  private moveByDirection(direction: number) {
    switch (direction) {
      case 0:
        this.moveUp();
        break;
      case 1:
        this.moveRight();
        break;
      case 2:
        this.moveDown();
        break;
      case 3:
        this.moveLeft();
        break;
    }
  }

  private moveUp() {
    this.setDirection = 0;
    this.setVelocity(0, -this.getSpeed);
    this.anims.play('enemy-up', true);
  }

  private moveRight() {
    this.setDirection = 1;
    this.setVelocity(this.getSpeed, 0);
    this.flipX = false;
    this.anims.play('enemy-right', true);
  }

  private moveDown() {
    this.setDirection = 2;
    this.setVelocity(0, this.getSpeed);
    this.anims.play('enemy-down', true);
  }

  private moveLeft() {
    this.setDirection = 3;
    this.setVelocity(-this.getSpeed, 0);
    this.flipX = true;
    this.anims.play('enemy-right', true);
  }
}
