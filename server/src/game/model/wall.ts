import { CommonConfig } from '../commonConfig';
import { GameObject } from './gameObject';

export class Wall extends GameObject {
  // コンストラクタ
  constructor(x: number, y: number) {
    super(
      CommonConfig.WALL_WIDTH,
      CommonConfig.WALL_HEIGHT,
      x,
      y,
      0
    );
  }
}
