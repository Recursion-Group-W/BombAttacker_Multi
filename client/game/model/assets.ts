export class Assets {
  // 背景画像
  imageField = new Image();

  rectFieldInFieldImage = {
    sx: 0,
    sy: 0,
    sw: 512,
    sh: 512,
  };
  // コンストラクタ
  constructor() {
    this.imageField.src = '../../public/assets/grass01.png';
  }
}
