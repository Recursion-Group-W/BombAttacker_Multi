import { ServerConfig } from '../serverConfig';
import { Bullet } from './bullet';
import { Tank } from './tank';
import { Wall } from './wall';

// ボットタンククラス
export class BotTank extends Tank {
  isBot = true;
  constructor(
    public id: number,
    userName: string,
    rectField: any,
    wallSet: Set<Wall>
  ) {
    // 親クラスのコンストラクタ呼び出し
    super(0, '', '', userName, rectField, wallSet);
    this.fSpeed = ServerConfig.BOTTANK_SPEED;
    this.objMovement['forward'] = true; // ひたすら前進。ものに当たったら、方向をランダムで変える。
  }

  // 更新
  // ※rectField : フィールド矩形は、オブジェクト中心と判定する。（OverlapTester.pointInRect()）
  //               オブジェクトの大きさ分狭めた(上下左右で、大きさの半分づつ狭めた）矩形が必要。
  //               呼び出され側で領域を狭めのは、処理コストが無駄なので、呼び出す側で領域を狭めて渡す。
  update(
    deltaTime: number,
    rectField: any,
    wallSet: Set<Wall>
  ) {
    // 親クラスの関数呼び出し
    const bDrived = super.update(
      deltaTime,
      rectField,
      wallSet
    );

    if (!bDrived) {
      // 前進できなかった
      // 方向転換
      this.angle = Math.random() * 2 * Math.PI;
    }
    return bDrived;
  }

  // ショット
  shoot(): Bullet | null {
    if (!this.canShoot()) {
      // ショット不可の場合は、nullを返す
      return null;
    }

    // 最終ショット時刻を更新
    this.iTimeLastShoot = Date.now();

    // 新しい弾丸の生成（先端から出ているようにするために、幅の半分オフセットした位置に生成する）
    const x =
      this.x + this.width * 0.5 * Math.cos(this.angle);
    const y =
      this.y + this.width * 0.5 * Math.sin(this.angle);
    return new Bullet(x, y, this.angle, this);
  }
}
