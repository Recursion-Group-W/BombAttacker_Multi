import { Movement } from '../../types/movement.type';
import { OverlapTester } from '../util/overlapTester';
import { Bomb } from './bomb';
import { Character } from './character';
import { Obstacle } from './obstacle';

export class Player extends Character {
  private movement: Movement = {
    up: false,
    right: false,
    down: false,
    left: false,
  };

  private bombList: Bomb[] = [];
  private bombCountMax = 1;
  private score = 0;

  // コンストラクタ
  constructor(
    public id: number,
    public clientId: string,
    public userName: string,
    obstacleSet: Set<Obstacle>
  ) {
    super(userName, obstacleSet);
    this.setSpriteKey = 'player';
  }

  // 更新
  update(deltaTime: number, obstacleSet: Set<Obstacle>) {
    // 移動前座標値のバックアップ
    const prevPosition = {
      x: this.getPosition.x,
      y: this.getPosition.y,
    };

    //movementにtrueの値がない（動作がない）場合
    //移動や衝突判定はせず、アニメーションだけセットする
    if (
      !Object.values(this.movement).some((value) => value)
    ) {
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
    }
    if (collision) {
      this.setPosition(prevPosition.x, prevPosition.y);
    }
  }
  toJSON() {
    return Object.assign(super.toJSON(), {
      clientId: this.clientId,
      score: this.score,
    });
  }

  setMovement(movement: Movement): void {
    this.movement = movement;
  }

  // 爆弾を置く
  putBomb() {
    if (!this.canPutBomb()) {
      return null;
    }

    const bomb = new Bomb(
      this.getPosition.x,
      this.getPosition.y,
      this
    );
    this.bombList.push(bomb);
    return bomb;
  }


  // 爆弾を置けるかどうか
  private canPutBomb() {
    return this.bombList.length < this.bombCountMax;
  }
}
