import { CommonConfig } from '../../config/commonConfig';
import { TankGameObject } from './tankgameObject';

export class TankObstacle extends TankGameObject {
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
