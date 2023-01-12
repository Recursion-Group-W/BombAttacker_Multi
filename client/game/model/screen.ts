import { ClientConfig } from '../clientConfig';
import { CommonConfig } from '../commonConfig';
import { Assets } from './assets';

// スクリーンクラス
export class Screen {
  context;
  assets = new Assets();
  iProcessingTimeNanoSec = 0;
  tankArr = Array<any>();
  wallArr = Array<any>();
  bulletArr = Array<any>();
  botArr = Array<any>();

  // 描画中心座標値
  centerX = CommonConfig.FIELD_WIDTH * 0.5;
  centerY = CommonConfig.FIELD_HEIGHT * 0.5;

  // コンストラクタ
  constructor(
    public socket: any,
    public canvas: HTMLCanvasElement
  ) {
    this.context = canvas.getContext('2d');

    // キャンバスの初期化
    this.canvas.width = CommonConfig.FIELD_WIDTH;
    this.canvas.height = CommonConfig.FIELD_HEIGHT;

    if (this.context) {
      // コンテキストの初期化
      // アンチエイリアスの抑止（画像がぼやけるのの防止）以下４行
      //   this.context.mozImageSmoothingEnabled = false;
      //   this.context.webkitImageSmoothingEnabled = false;
      //   this.context.msImageSmoothingEnabled = false;
      this.context.imageSmoothingEnabled = false;
    }

    //初期状態を取得したいということをサーバーに伝える
    // this.socket.emit('getInitialState');

    //サーバーからゲームデータを受け取る
    this.socket.on(
      'syncGame',
      (res: {
        nanoSecDiff: number;
        tankArr: any[];
        obstacleArr: any[];
        bulletArr: any[];
        botArr: any[];
      }) => {
        this.iProcessingTimeNanoSec = res.nanoSecDiff;
        this.tankArr = res.tankArr;
        this.wallArr = res.obstacleArr;
        this.bulletArr = res.bulletArr;
        this.botArr = res.botArr;
      }
    );

    // デッドした時の処理
    this.socket.on('dead', () => {
      // $('#start-screen').show();
    });
  }

  // アニメーション（無限ループ処理）
  animate(currTime: number) {
    requestAnimationFrame((currTime) => {
      this.animate(currTime);
    });
    this.render(currTime);
  }

  // 描画。animateから無限に呼び出される
  render(currTime: number) {
    if (!this.context) return;

    let myTank = null;
    if (this.tankArr.length !== 0) {
      this.tankArr.forEach((tank) => {
        if (tank.clientId === this.socket.clientId) {
          myTank = tank;
        }
      });
    }

    // 描画中心座標値
    // if (null !== myTank) {
    //   // 自タンク座標値
    //   this.centerX = myTank.x;
    //   this.centerY = myTank.y;
    // }

    // キャンバスのクリア
    this.context.clearRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    // 全体を平行移動
    // 中心座標値が(CenterX, CenterY)、キャンバスの大きさが(CanvasX, CanvaxY)の場合
    // キャンバス中心は(CanvasX/2, CanvasY/2)
    // 中心座標値とキャンバス中心との差分、オフセットする。
    // オフセット量は、{ -(CenterX - CanvasX/2), -(CenterY - CanvasY/2) } => { CanvasX * 0.5 - CenterX, CanvasY * 0.5 - CanvasY}
    // this.context.save();
    // this.context.translate(
    //   this.canvas.width * 0.5 - this.centerX,
    //   this.canvas.height * 0.5 - this.centerY
    // );

    // キャンバスの塗りつぶし
    this.renderField();

    // タンクの描画
    if (this.tankArr.length !== 0) {
      const currTimeSec = currTime * 0.001; // iTimeCurrentは、ミリ秒。秒に変換。
      const frameIndex = Math.round(currTimeSec / 0.2) % 2; // フレーム番号
      this.tankArr.forEach((tank) => {
        this.renderTank(tank, frameIndex);
      });
    }

    //ボットの描画
    if (this.botArr.length !== 0) {
      const currTimeSec = currTime * 0.001; // iTimeCurrentは、ミリ秒。秒に変換。
      const frameIndex = Math.round(currTimeSec / 0.2) % 2; // フレーム番号
      this.botArr.forEach((bot) => {
        this.renderTank(bot, frameIndex);
      });
    }

    // 壁の描画
    if (this.wallArr.length !== 0) {
      this.wallArr.forEach((wall) => {
        this.renderWall(wall);
      });
    }

    // 弾丸の描画
    if (this.bulletArr.length !== 0) {
      this.bulletArr.forEach((bullet) => {
        this.renderBullet(bullet);
      });
    }

    // 全体を平行移動の終了
    // this.context.restore();

    // キャンバスの枠の描画
    this.context.save();
    this.context.strokeStyle = ClientConfig.FIELD_LINECOLOR;
    this.context.lineWidth = ClientConfig.FIELD_LINEWIDTH;
    this.context.strokeRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    this.context.restore();

    // console.log('mytank: ', myTank);
    // 画面左上に得点表示
    if (myTank) {
      this.context.save();
      this.context.font = ClientConfig.SCORE_FONT;
      this.context.fillStyle = ClientConfig.SCORE_COLOR;
      this.context.fillText(
        'Score : ' + myTank.iScore,
        20,
        40
      );
      this.context.restore();
    }

    // 画面右上にサーバー処理時間表示
    this.context.save();
    this.context.font = ClientConfig.PROCESSINGTIME_FONT;
    this.context.fillStyle =
      ClientConfig.PROCESSINGTIME_COLOR;
    this.context.fillText(
      (this.iProcessingTimeNanoSec * 1e-9).toFixed(9) +
        ' [s]',
      this.canvas.width - 30 * 10,
      40
    );
    this.context.restore();
  }

  renderField() {
    if (!this.context) return;

    this.context.save();

    let countX =
      CommonConfig.FIELD_WIDTH /
      ClientConfig.FIELDTILE_WIDTH;
    let countY =
      CommonConfig.FIELD_HEIGHT /
      ClientConfig.FIELDTILE_HEIGHT;

    for (let iy = 0; iy < countY; iy++) {
      for (let ix = 0; ix < countX; ix++) {
        this.context.drawImage(
          this.assets.imageField,
          this.assets.rectFieldInFieldImage.sx,
          this.assets.rectFieldInFieldImage.sy, // 描画元画像の右上座標
          this.assets.rectFieldInFieldImage.sw,
          this.assets.rectFieldInFieldImage.sh, // 描画元画像の大きさ
          ix * ClientConfig.FIELDTILE_WIDTH, // 画像先領域の右上座標（領域中心が、原点になるように指定する）
          iy * ClientConfig.FIELDTILE_HEIGHT, // 画像先領域の右上座標（領域中心が、原点になるように指定する）
          ClientConfig.FIELDTILE_WIDTH, // 描画先領域の大きさ
          ClientConfig.FIELDTILE_HEIGHT
        ); // 描画先領域の大きさ
      }
    }

    this.context.restore();
  }

  renderTank(tank: any, frameIndex: number) {
    if (!this.context) return;

    this.context.save();

    // タンクの座標値に移動
    this.context.translate(tank.x, tank.y);

    // 画像描画
    this.context.save();
    this.context.rotate(tank.angle);
    this.context.drawImage(
      this.assets.imageItems,
      this.assets.arectTankInItemsImage[frameIndex].sx,
      this.assets.arectTankInItemsImage[frameIndex].sy, // 描画元画像の右上座標
      this.assets.arectTankInItemsImage[frameIndex].sw,
      this.assets.arectTankInItemsImage[frameIndex].sh, // 描画元画像の大きさ
      -CommonConfig.TANK_WIDTH * 0.5, // 画像先領域の右上座標（領域中心が、原点になるように指定する）
      -CommonConfig.TANK_HEIGHT * 0.5, // 画像先領域の右上座標（領域中心が、原点になるように指定する）
      CommonConfig.TANK_WIDTH, // 描画先領域の大きさ
      CommonConfig.TANK_HEIGHT
    ); // 描画先領域の大きさ
    this.context.restore();

    // ライフ
    const fLifeCellWidth =
      CommonConfig.TANK_WIDTH / tank.iLifeMax;
    const fLifeCellStartX = -(
      fLifeCellWidth *
      tank.iLifeMax *
      0.5
    );
    // ゼロからライフ値まで：REMAINING_COLOR

    this.context.fillStyle =
      ClientConfig.LIFE_REMAINING_COLOR;
    this.context.fillRect(
      fLifeCellStartX,
      CommonConfig.TANK_WIDTH * 0.5,
      fLifeCellWidth * tank.iLife,
      10
    );

    // ライフ値からライフマックスまで：MISSING_COLOR
    if (tank.iLife < tank.iLifeMax) {
      this.context.fillStyle =
        ClientConfig.LIFE_MISSING_COLOR;
      this.context.fillRect(
        fLifeCellStartX + fLifeCellWidth * tank.iLife,
        CommonConfig.TANK_WIDTH * 0.5,
        fLifeCellWidth * (tank.iLifeMax - tank.iLife),
        10
      );
    }

    // ニックネーム
    this.context.save();
    this.context.textAlign = 'center';
    this.context.font = ClientConfig.NICKNAME_FONT;
    this.context.fillStyle = ClientConfig.NICKNAME_COLOR;
    this.context.fillText(tank.userName, 0, -50);
    this.context.restore();

    this.context.restore();
  }

  renderWall(wall: any) {
    if (!this.context) return;

    // 画像描画
    this.context.drawImage(
      this.assets.imageItems,
      this.assets.rectWallInItemsImage.sx,
      this.assets.rectWallInItemsImage.sy, // 描画元画像の右上座標
      this.assets.rectWallInItemsImage.sw,
      this.assets.rectWallInItemsImage.sh, // 描画元画像の大きさ
      wall.x - CommonConfig.WALL_WIDTH * 0.5, // 画像先領域の右上座標（領域中心が、原点になるように指定する）
      wall.y - CommonConfig.WALL_HEIGHT * 0.5, // 画像先領域の右上座標（領域中心が、原点になるように指定する）
      CommonConfig.WALL_WIDTH, // 描画先領域の大きさ
      CommonConfig.WALL_HEIGHT
    ); // 描画先領域の大きさ
  }

  renderBullet(bullet: any) {
    if (!this.context) return;

    this.context.save();

    // 弾丸の座標値に移動
    this.context.translate(bullet.x, bullet.y);

    // 画像描画
    this.context.rotate(bullet.angle);
    this.context.drawImage(
      this.assets.imageItems,
      this.assets.rectBulletInItemsImage.sx,
      this.assets.rectBulletInItemsImage.sy, // 描画元画像の右上座標
      this.assets.rectBulletInItemsImage.sw,
      this.assets.rectBulletInItemsImage.sh, // 描画元画像の大きさ
      -CommonConfig.BULLET_WIDTH * 0.5, // 画像先領域の右上座標（領域中心が、原点になるように指定する）
      -CommonConfig.BULLET_HEIGHT * 0.5, // 画像先領域の右上座標（領域中心が、原点になるように指定する）
      CommonConfig.BULLET_WIDTH, // 描画先領域の大きさ
      CommonConfig.BULLET_HEIGHT
    ); // 描画先領域の大きさ

    this.context.restore();
  }
}
