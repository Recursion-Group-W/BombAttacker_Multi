import { RectBound } from '../../../types/rectBound.type';
import { CommonConfig } from '../../config/commonConfig';
import { ServerConfig } from '../../config/serverConfig';
import { ObjectUtil } from '../../util/object.util';
import { OverlapTester } from '../../util/overlapTester';
import { Bullet } from './bullet';
import { TankGameObject } from './tankgameObject';
import { TankObstacle } from './tankObstacle';

export class Tank extends TankGameObject {
  static WIDTH = 80;
  static HEIGHT = 80;
  objMovement: { [key: string]: boolean } = {}; // 動作
  fSpeed = ServerConfig.TANK_SPEED; // 速度[m/s]。1frameあたり5進む => 1/30[s] で5進む => 1[s]で150進む。
  fRotationSpeed = ServerConfig.TANK_ROTATION_SPEED; // 回転速度[rad/s]。1frameあたり0.1進む => 1/30[s] で0.1進む => 1[s]で3[rad]進む。
  iTimeLastShoot = 0; // 最終ショット時刻
  iLife = ServerConfig.TANK_LIFE_MAX;
  iLifeMax = ServerConfig.TANK_LIFE_MAX;
  iScore = 0;
  // タンクの可動域
  rectField = ObjectUtil.calRectField(
    Tank.WIDTH,
    Tank.HEIGHT
  );

  // コンストラクタ
  constructor(
    public id: number,
    public clientId: string,
    public userName: string,
    obstacleSet: Set<TankObstacle>
  ) {
    // 親クラスのコンストラクタ呼び出し
    super(
      Tank.WIDTH,
      Tank.HEIGHT,
      0.0,
      0.0,
      Math.random() * 2 * Math.PI
    );

    //初期位置に配置
    this.setInitialPosition(obstacleSet);
  }

  //初期位置に配置するメソッド
  setInitialPosition(obstacleSet: Set<TankObstacle>) {
    // 初期位置
    this.setPosition(
      Math.random() *
        (CommonConfig.FIELD_WIDTH - Tank.WIDTH),
      Math.random() *
        (CommonConfig.FIELD_HEIGHT - Tank.HEIGHT)
    );

    // 障害物にぶつからない初期位置の算出
    do {
      this.setPosition(
        this.rectField.left +
          Math.random() *
            (this.rectField.right - this.rectField.left),
        this.rectField.bottom +
          Math.random() *
            (this.rectField.top - this.rectField.bottom)
      );
    } while (this.overlapObstacles(obstacleSet));
  }

  // ※rectField : フィールド矩形は、オブジェクト中心と判定する。（OverlapTester.pointInRect()）
  //               オブジェクトの大きさ分狭めた(上下左右で、大きさの半分づつ狭めた）矩形が必要。
  //               呼び出され側で領域を狭めのは、処理コストが無駄なので、呼び出す側で領域を狭めて渡す。

  // 更新
  update(
    deltaTime: number,
    rectField: RectBound,
    obstacleSet: Set<TankObstacle>
  ) {
    const fX_old = this.getPosition.x; // 移動前座標値のバックアップ
    const fY_old = this.getPosition.y; // 移動前座標値のバックアップ
    let bDrived = false; // 前後方向の動きがあったか
    // 動作に従って、タンクの状態を更新
    if (this.objMovement['forward']) {
      // 前進
      const fDistance = this.fSpeed * deltaTime;
      this.setPosition(
        this.getPosition.x +
          fDistance * Math.cos(this.angle),
        this.getPosition.y +
          fDistance * Math.sin(this.angle)
      );
      bDrived = true;
    }
    if (this.objMovement['back']) {
      // 後進
      const fDistance = this.fSpeed * deltaTime;
      this.setPosition(
        this.getPosition.x -
          fDistance * Math.cos(this.angle),
        this.getPosition.y -
          fDistance * Math.sin(this.angle)
      );
      bDrived = true;
    }
    if (bDrived) {
      // 動きがある場合は、不可侵領域との衝突のチェック
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
      if (bCollision) {
        // 衝突する場合は、移動できない。
        this.setPosition(fX_old, fY_old);
        bDrived = false; // 前後方向の動きはなし
      }
    }

    if (this.objMovement['left']) {
      // 左転回
      //console.log( 'left' );
      // X軸が右向き、Y軸が「上」向きの世界では、左回転は、角度が増える方向
      // X軸が右向き、Y軸が「下」向きの世界では、左回転は、角度が減る方向
      //this.fAngle += this.fRotationSpeed * fDeltaTime;  // Y軸が「上」向き用（WebGLキャンバスへの描画用）
      this.angle -= this.fRotationSpeed * deltaTime; // Y軸が「下」向き用（2Dキャンバスへの描画用）
    }
    if (this.objMovement['right']) {
      // 右転回
      //console.log( 'right' );
      // X軸が右向き、Y軸が「上」向きの世界では、右回転は、角度が減る方向
      // X軸が右向き、Y軸が「下」向きの世界では、右回転は、角度が増える方向
      //this.fAngle -= this.fRotationSpeed * fDeltaTime;  // Y軸が「上」向き用（WebGLキャンバスへの描画用）
      this.angle += this.fRotationSpeed * deltaTime; // Y軸が「下」向き用（2Dキャンバスへの描画用）
    }

    // console.log(
    //   'tank posision: {x: ',
    //   this.x,
    //   ', y: ',
    //   this.y,
    //   ' }'
    // );
    return bDrived; // 前後方向の動きがあったかを返す（ボットタンクで使用する）
  }

  toJSON() {
    return Object.assign(super.toJSON(), {
      clientId: this.clientId,
      userName: this.userName,
      iLife: this.iLife,
      iLifeMax: this.iLifeMax,
      iScore: this.iScore,
    });
  }

  // ショット可能かどうか
  canShoot() {
    if (
      ServerConfig.TANK_WAIT_FOR_NEW_BULLET >
      Date.now() - this.iTimeLastShoot
    ) {
      // ショット待ち時間内はショット不可
      return false;
    }

    return true;
  }

  // ショット
  shoot() {
    if (!this.canShoot()) {
      // ショット不可の場合は、nullを返す
      return null;
    }

    // 最終ショット時刻を更新
    this.iTimeLastShoot = Date.now();

    // 新しい弾丸の生成（先端から出ているようにするために、幅の半分オフセットした位置に生成する）
    const x =
      this.getPosition.x +
      this.getWidth * 0.5 * Math.cos(this.angle);
    const y =
      this.getPosition.y +
      this.getWidth * 0.5 * Math.sin(this.angle);
    return new Bullet(x, y, this.angle, this);
  }

  // ダメージ
  damage() {
    this.iLife--;
    return this.iLife;
  }
}
