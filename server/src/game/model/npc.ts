import { MathUtil } from '../util/math.util';
import { OverlapTester } from '../util/overlapTester';
import { Character } from './character';
import { Obstacle } from './obstacle';
import { Player } from './player';

export class Npc extends Character {
  // コンストラクタ
  constructor(
    public id: number,
    obstacleSet: Set<Obstacle>
  ) {
    super('npc', obstacleSet);
    this.setSpriteKey = 'npc';
  }

  // 更新
  update(
    deltaTime: number,
    obstacleSet: Set<Obstacle>,
    playerSet: Set<Player>
  ) {
    // 移動前座標値のバックアップ
    const prevPosition = {
      x: this.getPosition.x,
      y: this.getPosition.y,
    };

    //movementにtrueの値がない（動作がない）場合
    //移動や衝突判定はせず、アニメーションだけセットする
    // if (
    //   !Object.values(this.movement).some((value) => value)
    // ) {
    //   //キーが押されていない時
    //   switch (this.getDirection) {
    //     case 0:
    //       this.animTurnUp();
    //       break;
    //     case 1:
    //       this.animTurnRight();
    //       break;
    //     case 2:
    //       this.animTurnDown();
    //       break;
    //     case 3:
    //       this.animTurnRight();
    //       break;
    //   }
    //   return;
    // }

    const distance = this.speed * deltaTime;

    // movementによって、プレイヤーの向きと位置を更新
    if (this.movement.up) {
      this.setDirection = 0;
      this.animWalkUp();
      this.move(0, -distance);
    }
    if (this.movement.right) {
      this.setDirection = 1;
      this.animWalkRight();
      this.move(distance, 0);
    }
    if (this.movement.down) {
      this.setDirection = 2;
      this.animWalkDown();
      this.move(0, distance);
    }
    if (this.movement.left) {
      this.setDirection = 3;
      this.animWalkRight();
      this.move(-distance, 0);
    }

    //衝突判定
    let collision = false;
    if (
      !OverlapTester.pointInRect(this.rectField, {
        x: this.getPosition.x,
        y: this.getPosition.y,
      })
    ) {
      // フィールドの外に出た。
      collision = true;
    } else if (this.overlapObstacles(obstacleSet)) {
      // 壁に当たった。
      collision = true;
    } else if (this.overlapPlayers(playerSet)) {
      collision = true;
    }
    if (collision) {
      this.setPosition(prevPosition.x, prevPosition.y);
    }
  }
  toJSON() {
    return Object.assign(super.toJSON(), {});
  }

  protected overlapPlayers(playerSet: Set<Player>) {
    return Array.from(playerSet).some((player) => {
      if (
        OverlapTester.overlapRects(
          this.rectBound,
          player.rectBound
        )
      ) {
        return true;
      }
    });
  }

  //ランダムな動き
  moveRamdom(deltaTime: number) {
    if (this.isMoving()) return;

    if (this.getVelocity.x + this.getVelocity.y === 0) {
      //4方向をランダムに選択して動かす
      const randomDir: number = MathUtil.getRandomInt(0, 3);
      this.moveByDirection(randomDir, deltaTime);
    }
  }

  //XかYのどちらかの単調な動き
  moveMonotone(deltaTime: number) {
    if (this.isMoving()) return;

    if (this.getVelocity.x + this.getVelocity.y === 0) {
      //XかYのどちらかの方向をランダムに選択して動かす
      const randomDir: number = MathUtil.getRandomInt(0, 1);
      switch (randomDir) {
        case 0:
          this.moveMonoX(deltaTime);
          break;
        case 1:
          this.moveMonoY(deltaTime);
          break;
      }
    }
  }

  //プレイヤーと衝突した時、反対方向に向きを変える
  collideWithPlayer(deltaTime: number) {
    const opposite = this.getOppositeDirection(
      this.getDirection
    );
    this.moveByDirection(opposite, deltaTime);
  }

  //追跡する動き
  chasePlayer(player: Player) {}

  //X方向の単調な動き
  private moveMonoX(deltaTime: number) {
    //動いている(障害物にぶつかっていない) → 何もしない
    if (this.isMoving()) return;

    //移動速度を0に更新
    this.setVelocity(this.getVelocity.x, 0);

    //速度が0(障害物にぶつかったorゲームスタート時) → 方向転換する
    if (this.getVelocity.x === 0) {
      const opposite = this.getOppositeDirection(
        this.getDirection
      );
      this.moveByDirection(opposite, deltaTime);
    }
  }

  //Y方向の単調な動き
  private moveMonoY(deltaTime: number) {
    //動いている(障害物にぶつかっていない) → 何もしない
    if (this.isMoving()) return;

    //移動速度を0に更新
    this.setVelocity(0, this.getVelocity.y);

    //速度が0(障害物にぶつかったorゲームスタート時) → 方向転換する
    if (this.getVelocity.y === 0) {
      const opposite = this.getOppositeDirection(
        this.getDirection
      );
      this.moveByDirection(opposite, deltaTime);
    }
  }

  //動いているかどうか
  private isMoving(): boolean {
    return this.getVelocity.x + this.getVelocity.y !== 0;
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
  private moveByDirection(
    direction: number,
    deltaTime: number
  ) {
    switch (direction) {
      case 0:
        this.moveUp(deltaTime);
        break;
      case 1:
        this.moveRight(deltaTime);
        break;
      case 2:
        this.moveDown(deltaTime);
        break;
      case 3:
        this.moveLeft(deltaTime);
        break;
    }
  }

  private moveUp(deltaTime: number) {
    this.setDirection = 0;
    this.setVelocity(0, -this.getSpeed);
    this.move(deltaTime);
    this.animWalkUp();
  }

  private moveRight(deltaTime: number) {
    this.setDirection = 1;
    this.setVelocity(this.getSpeed, 0);
    this.move(deltaTime);
    // this.flipX = false; //クライアントで反転を制御
    this.animWalkRight();
  }

  private moveDown(deltaTime: number) {
    this.setDirection = 2;
    this.setVelocity(0, this.getSpeed);
    this.move(deltaTime);
    this.animWalkDown();
  }

  private moveLeft(deltaTime: number) {
    this.setDirection = 3;
    this.setVelocity(-this.getSpeed, 0);
    this.move(deltaTime);
    // this.flipX = true;//クライアントで反転を制御
    this.animWalkRight();
  }
}
