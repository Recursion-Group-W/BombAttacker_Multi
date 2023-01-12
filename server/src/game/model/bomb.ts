import { Explosion } from './explosion';
import { GameObject } from './gameObject';
import { Player } from './player';

export class Bomb extends GameObject {
  static WIDTH = 16;
  static HEIGHT = 16;
  private remainTime: number = 5;

  constructor(
    x: number,
    y: number,
    private player: Player
  ) {
    // 親クラスのコンストラクタ呼び出し
    super(Bomb.WIDTH, Bomb.HEIGHT, x, y);
  }

  update(deltaTime: number) {
    this.remainTime -= deltaTime;
    if (this.remainTime < 0) {
      //爆発
      // new Explosion();
    }
  }
}
