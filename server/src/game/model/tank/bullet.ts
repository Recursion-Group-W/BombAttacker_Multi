import { RectBound } from '../../../types/rectBound.type';
import { CommonConfig } from '../../config/commonConfig';
import { ServerConfig } from '../../config/serverConfig';
import { OverlapTester } from '../../util/overlapTester';
import { TankGameObject } from './tankgameObject';
import { Tank } from './tank';

// 弾丸クラス
export class Bullet extends TankGameObject {
  fSpeed = ServerConfig.BULLET_SPEED;
  fLifeTime = ServerConfig.BULLET_LIFETIME_MAX;

  constructor(
    x: number,
    y: number,
    angle: number,
    public tank: Tank
  ) {
    // 親クラスのコンストラクタ呼び出し
    super(
      CommonConfig.BULLET_WIDTH,
      CommonConfig.BULLET_HEIGHT,
      x,
      y,
      angle
    );
  }

  // 更新
  // ※rectField : フィールド矩形は、オブジェクト中心と判定する。（OverlapTester.pointInRect()）
  //               オブジェクトの大きさ分狭めた(上下左右で、大きさの半分づつ狭めた）矩形が必要。
  //               呼び出され側で領域を狭めのは、処理コストが無駄なので、呼び出す側で領域を狭めて渡す。
  update(
    deltaTime: number,
    rectField: RectBound,
    obstacleSet: any
  ) {
    this.fLifeTime -= deltaTime;
    if (0 > this.fLifeTime) {
      // 寿命が尽きた
      return true; // 消失かどうか。trueを返す。
    }

    // 前進
    const fDistance = this.fSpeed * deltaTime;
    this.setPosition(
      this.getPosition.x + fDistance * Math.cos(this.angle),
      this.getPosition.y + fDistance * Math.sin(this.angle)
    );

    // 不可侵領域との衝突のチェック
    let bCollision = false;
    if (
      !OverlapTester.pointInRect(rectField, {
        x: this.getPosition.x,
        y: this.getPosition.y,
      })
    ) {
      // フィールドの外に出た。
      bCollision = true;
    } else if (this.overlapObstacles(obstacleSet)) {
      // 壁に当たった。
      bCollision = true;
    }

    return bCollision; // 消失かどうか。不可侵領域に当たったかを返す。
  }
}
