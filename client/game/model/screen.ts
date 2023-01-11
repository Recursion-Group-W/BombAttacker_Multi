import { ClientConfig } from '../clientConfig';
import { CommonConfig } from '../commonConfig';
import { Assets } from './assets';

// スクリーンクラス
export class Screen {
  context;
  assets = new Assets();
  iProcessingTimeNanoSec = 0;
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
      (res: { nanoSecDiff: number }) => {
        this.iProcessingTimeNanoSec = res.nanoSecDiff;
      }
    );
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
    // キャンバスのクリア
    this.context.clearRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    // キャンバスの塗りつぶし
    this.renderField();

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

    let iCountX =
      CommonConfig.FIELD_WIDTH /
      ClientConfig.FIELDTILE_WIDTH;
    let iCountY =
      CommonConfig.FIELD_HEIGHT /
      ClientConfig.FIELDTILE_HEIGHT;

    for (let iIndexY = 0; iIndexY < iCountY; iIndexY++) {
      for (let iIndexX = 0; iIndexX < iCountX; iIndexX++) {
        this.context.drawImage(
          this.assets.imageField,
          this.assets.rectFieldInFieldImage.sx,
          this.assets.rectFieldInFieldImage.sy, // 描画元画像の右上座標
          this.assets.rectFieldInFieldImage.sw,
          this.assets.rectFieldInFieldImage.sh, // 描画元画像の大きさ
          iIndexX * ClientConfig.FIELDTILE_WIDTH, // 画像先領域の右上座標（領域中心が、原点になるように指定する）
          iIndexY * ClientConfig.FIELDTILE_HEIGHT, // 画像先領域の右上座標（領域中心が、原点になるように指定する）
          ClientConfig.FIELDTILE_WIDTH, // 描画先領域の大きさ
          ClientConfig.FIELDTILE_HEIGHT
        ); // 描画先領域の大きさ
      }
    }

    this.context.restore();
  }
}
