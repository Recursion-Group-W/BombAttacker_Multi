import { MathUtil } from '../util/math.util';
import { OverlapTester } from '../util/overlapTester';
import { Character } from './character';
import { GenericObstacle } from './obstacle/generic/genericObstacle';
import { Player } from './player/player';

export class Npc extends Character {
  static readonly SPRITE_KEY = 'npc';
  // コンストラクタ
  constructor(
    public id: number,
    obstacleSet: Set<GenericObstacle>
  ) {
    super('npc', Npc.SPRITE_KEY, obstacleSet);
    this.setSpriteKey = 'npc';

    //初めに進む向きと速度をランダムにセット
    this.setMoveRamdom();
  }

  // 更新
  update(
    deltaTime: number,
    obstacleSet: Set<GenericObstacle>,
    playerSet: Set<Player>
  ) {
    // 移動前座標値のバックアップ
    const prevPosition = {
      x: this.getPosition.x,
      y: this.getPosition.y,
    };

    //速度が0の場合、
    //移動や衝突判定はせず、アニメーションだけセットする
    if (!this.isMoving()) {
      //キーが押されていない時
      switch (this.getDirection) {
        case 0:
          this.animTurnUp();
          break;
        case 1:
          this.animTurnRight();
          break;
        case 2:
          this.animTurnDown();
          break;
        case 3:
          this.animTurnRight();
          break;
      }
      return;
    }

    //現在向いている方向に進む(deltaTimeの時間)
    this.move(deltaTime);

    //衝突判定
    let collision = false;
    if (
      !OverlapTester.pointInRect(this.rectField, {
        x: this.getPosition.x,
        y: this.getPosition.y,
      })
    ) {
      // ステージの端に衝突
      collision = true;
    } else if (this.overlapObstacles(obstacleSet)) {
      //障害物に衝突
      collision = true;
    } else if (this.overlapPlayers(playerSet)) {
      //プレイヤーに衝突
      collision = true;
    }
    if (collision) {
      //this.moveByDirection(this.getDirection, deltaTime)を実行する前の位置に戻す
      this.setPosition(prevPosition.x, prevPosition.y);

      //向きを変える
      //方向をランダムに選択
      this.setMoveRamdom();
    }
  }
  toJSON() {
    return Object.assign(super.toJSON(), {
      id: this.id,
    });
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

  //ランダムな動きをセット
  setMoveRamdom() {
    //4方向をランダムに選択して動かす
    const randomDir: number = MathUtil.getRandomInt(0, 3);
    this.setMoveByDirection(randomDir);
  }

  //XかYのどちらかの単調な動きをセット
  setMoveMonotone() {
    if (this.isMoving()) return;

    if (this.getVelocity.x + this.getVelocity.y === 0) {
      //XかYのどちらかの方向をランダムに選択して動かす
      const randomDir: number = MathUtil.getRandomInt(0, 1);
      switch (randomDir) {
        case 0:
          this.setMoveMonoX();
          break;
        case 1:
          this.setMoveMonoY();
          break;
      }
    }
  }

  //プレイヤーと衝突した時、反対方向に向きを変える
  collideWithPlayer(deltaTime: number) {
    const opposite = this.getOppositeDirection(
      this.getDirection
    );
    this.setMoveByDirection(opposite);
  }

  //Playerを追跡する動き
  chasePlayer(player: Player) {}

  //X方向の単調な動き
  private setMoveMonoX() {
    //動いている(障害物にぶつかっていない) → 何もしない
    if (this.isMoving()) return;

    //移動速度を0に更新
    this.setVelocity(this.getVelocity.x, 0);

    //速度が0(障害物にぶつかったorゲームスタート時) → 方向転換する
    if (this.getVelocity.x === 0) {
      const opposite = this.getOppositeDirection(
        this.getDirection
      );
      this.setMoveByDirection(opposite);
    }
  }

  //Y方向の単調な動きをセット
  private setMoveMonoY() {
    //動いている(障害物にぶつかっていない) → 何もしない
    if (this.isMoving()) return;

    //移動速度を0に更新
    this.setVelocity(0, this.getVelocity.y);

    //速度が0(障害物にぶつかったorゲームスタート時) → 方向転換する
    if (this.getVelocity.y === 0) {
      const opposite = this.getOppositeDirection(
        this.getDirection
      );
      this.setMoveByDirection(opposite);
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

  //direction(方向)を受け取って、その方向にセットするメソッド
  private setMoveByDirection(direction: number) {
    switch (direction) {
      case 0:
        this.setMoveUp();
        break;
      case 1:
        this.setMoveRight();
        break;
      case 2:
        this.setMoveDown();
        break;
      case 3:
        this.setMoveLeft();
        break;
    }
  }

  private setMoveUp() {
    this.setDirection = 0;
    this.setVelocity(0, -this.getSpeed);
    this.animWalkUp();
  }

  private setMoveRight() {
    this.setDirection = 1;
    this.setVelocity(this.getSpeed, 0);
    // this.flipX = false; //クライアントで反転を制御
    this.animWalkRight();
  }

  private setMoveDown() {
    this.setDirection = 2;
    this.setVelocity(0, this.getSpeed);
    this.animWalkDown();
  }

  private setMoveLeft() {
    this.setDirection = 3;
    this.setVelocity(-this.getSpeed, 0);
    // this.flipX = true;//クライアントで反転を制御
    this.animWalkRight();
  }
}
