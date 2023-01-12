import { RectBound } from '../../types/rectBound.type';
import { OverlapTester } from '../util/overlapTester';
import { Bomb } from './bomb';
import { Character } from './character';
import { Obstacle } from './obstacle';

export class Player extends Character {
  private movement = {
    up: false,
    right: false,
    down: false,
    left: false,
  };
  private spriteKey = 'player';

  private bombList: Bomb[] = [];
  private bombCountMax = 1;
  private score = 0;

  //位置を更新するかどうか(計算量を減らす)
  private shouldUpdate = true;

  // コンストラクタ
  constructor(
    public id: number,
    public clientId: string,
    public userName: string,
    obstacleSet: Set<Obstacle>
  ) {
    super(userName, obstacleSet);
  }

  // 更新
  update(
    deltaTime: number,
    rectField: RectBound,
    obstacleSet: Set<Obstacle>
  ) {
    // 移動前座標値のバックアップ
    const prevPosition = {
      x: this.getPosition.x,
      y: this.getPosition.y,
    };

    //shouldUpdateがfalseの時は、移動や衝突判定はせず、アニメーションだけセットする
    if (!this.shouldUpdate) {
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
    this.shouldUpdate = false;

    //衝突判定
    let collision = false;
    if (
      !OverlapTester.pointInRect(rectField, {
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
  }
  toJSON() {
    return Object.assign(super.toJSON(), {
      clientId: this.clientId,
      score: this.score,
    });
  }

  setMovement(movement: any): void {
    this.shouldUpdate = true;
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

  private move(x: number, y: number) {
    this.setPosition(
      this.getPosition.x + x,
      this.getPosition.y + y
    );
  }

  // 爆弾を置けるかどうか
  private canPutBomb() {
    return this.bombList.length < this.bombCountMax;
  }

  private animWalkUp() {
    this.animation = `${this.spriteKey}-up`;
  }
  private animWalkRight() {
    this.animation = `${this.spriteKey}-right`;
  }
  private animWalkDown() {
    this.animation = `${this.spriteKey}-down`;
  }
  private animTurnUp() {
    this.animation = `${this.spriteKey}-turn-up`;
  }
  private animTurnRight() {
    this.animation = `${this.spriteKey}-turn-right`;
  }
  private animTurnDown() {
    this.animation = `${this.spriteKey}-turn-down`;
  }
}
