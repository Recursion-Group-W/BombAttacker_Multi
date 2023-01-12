import { GameObject } from './gameObject';

export class Obstacle extends GameObject {
  static WIDTH = 16;
  static HEIGHT = 16;

  // コンストラクタ
  constructor(x: number, y: number) {
    super(Obstacle.WIDTH, Obstacle.HEIGHT, x, y);
  }
}
