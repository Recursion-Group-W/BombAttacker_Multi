import { GenericLinkedList } from '../../../linkedList/generic/genericLinkedList';
import { Movement } from '../../types/movement.type';
import { ObjectUtil } from '../../util/object.util';
import { OverlapUtil } from '../../util/overlap.util';
import { Bomb } from '../bomb';
import { Character } from '../character/character';
import { Npc } from '../npc/npc';
import { GenericObstacle } from '../obstacle/generic/genericObstacle';

export class Player extends Character {
  static readonly SPRITE_KEY = 'player';
  private movement: Movement = {
    up: false,
    right: false,
    down: false,
    left: false,
  };

  public bombList = new GenericLinkedList<Bomb>();
  private bombCountMax = 5;
  private score = 0;

  // コンストラクタ
  constructor(
    public id: number,
    public clientId: string,
    public userName: string,
    obstacleList: GenericLinkedList<GenericObstacle>
  ) {
    super(userName, Player.SPRITE_KEY, obstacleList);
  }

  // 更新
  update(
    deltaTime: number,
    // obstacleSet: Set<GenericObstacle>
    obstacleList: GenericLinkedList<GenericObstacle>,
    squareCache: Array<Array<GenericObstacle | null>>,
  ) {
    // 移動前座標値のバックアップ
    const prevPosition = {
      x: this.getPosition.x,
      y: this.getPosition.y,
    };

    //movementにtrueの値がない（動作がない）場合
    //移動や衝突判定はせず、アニメーションだけセットする
    if (!Object.values(this.movement).some((value) => value)) {
      this.setVelocity(0, 0);
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

    // movementによって、プレイヤーの向きと位置を更新
    if (this.movement.up) {
      this.setDirection = 0;
      this.setVelocity(0, -this.getSpeed);
      this.animWalkUp();
    }
    if (this.movement.right) {
      this.setDirection = 1;
      this.setVelocity(this.getSpeed, 0);
      this.animWalkRight();
    }
    if (this.movement.down) {
      this.setDirection = 2;
      this.setVelocity(0, this.getSpeed);
      this.animWalkDown();
    }
    if (this.movement.left) {
      this.setDirection = 3;
      this.setVelocity(-this.getSpeed, 0);
      this.animWalkRight();
    }
    //衝突判定の前に動作を実行する
    this.move(deltaTime);

    //衝突判定
    let collision = false;
    //移動補正値
    let correction = {
      x: 0,
      y: 0,
    };
    if (
      !OverlapUtil.pointInRect(this.rectField, {
        x: this.getPosition.x,
        y: this.getPosition.y,
      })
    ) {
      // フィールドの外に出た。
      collision = true;
    } else {
      //衝突した障害物
      let obstacleNode = this.overlapObstacles(obstacleList);
      if (obstacleNode) {
        // 障害物に当たった。
        collision = true;

        //移動補正値を計算
        ObjectUtil.calCorrection(squareCache, obstacleNode, this, correction);
      }
    }
    if (collision) {
      this.setPosition(
        prevPosition.x + correction.x,
        prevPosition.y + correction.y
      );
      this.setVelocity(0, 0);
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
  putBomb(id: number) {
    if (!this.canPutBomb()) {
      return null;
    }

    const bomb = new Bomb(id, this.getPosition.x, this.getPosition.y, this);
    this.bombList.pushBack(bomb);
    return new Bomb(id, this.getPosition.x, this.getPosition.y, this);
  }

  // 爆弾を置けるかどうか
  private canPutBomb() {
    return this.bombList.size() < this.bombCountMax;
  }
}
