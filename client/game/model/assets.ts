export class Assets {
  // 背景画像
  imageField = new Image();

  rectFieldInFieldImage = {
    sx: 0,
    sy: 0,
    sw: 1024,
    sh: 1024,
  };
  // アイテム画像
  imageItems = new Image();

  arectTankInItemsImage = [
    { sx: 2, sy: 2, sw: 16, sh: 16 },
    { sx: 20, sy: 2, sw: 16, sh: 16 },
  ];

  rectWallInItemsImage = { sx: 38, sy: 2, sw: 64, sh: 16 };
  rectBulletInItemsImage = { sx: 104, sy: 2, sw: 8, sh: 8 };

  imageObstacles = new Image();

  rectObstacleImage = [
    { sx: 0, sy: 32, sw: 32, sh: 32 },
    { sx: 64, sy: 32, sw: 32, sh: 32 },
  ];

  imageWalls = new Image()

  rectWallImage = {sx: 0, sy: 64, sw: 32, sh: 32}

  imagePlayer = new Image();

  rectPlayerImage = [
    { sx: 32, sy: 0, sw: 32, sh: 32 },
    { sx: 64, sy: 0, sw: 32, sh: 32 },
    { sx: 96, sy: 0, sw: 32, sh: 32 },
  ];

  constructor() {
    this.imageField.src = '/assets/vermeer.png';

    this.imageItems.src = '/assets/items.png';

    this.imageObstacles.src = '/assets/tileset.png';

    this.imagePlayer.src =
      '/assets/player_spritesheet_fixed.png';
  }
}
