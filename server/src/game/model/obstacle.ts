import { GameObject } from './gameObject';

export class Obstacle extends GameObject {
  static WIDTH = 32;
  static HEIGHT = 32;

  // コンストラクタ
  constructor(x: number, y: number) {
    super(x, y, Obstacle.WIDTH, Obstacle.HEIGHT);
  }
}
