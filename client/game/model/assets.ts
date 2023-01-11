export class Assets {
  // 背景画像
  imageField = new Image();

  rectFieldInFieldImage = {
    sx: 0,
    sy: 0,
    sw: 512,
    sh: 512,
  };
  // アイテム画像
  imageItems = new Image();

  arectTankInItemsImage = [
    { sx: 2, sy: 2, sw: 16, sh: 16 },
    { sx: 20, sy: 2, sw: 16, sh: 16 },
  ];

  rectWallInItemsImage = { sx: 38, sy: 2, sw: 64, sh: 16 };
  rectBulletInItemsImage = { sx: 104, sy: 2, sw: 8, sh: 8 };

  constructor() {
    this.imageField.src = '/assets/grass01.png';

    this.imageItems.src = '/assets/items.png';
  }
}
