import { Explosion } from './explosion';
import { GameObject } from './gameObject/gameObject';
import { Player } from './player/player';

export class Bomb extends GameObject {
  static WIDTH = 38.4;
  static HEIGHT = 38.4;
  private remainTime: number = 5;

  constructor(x: number, y: number, private player: Player) {
    // 親クラスのコンストラクタ呼び出し
    super(x, y, Bomb.WIDTH, Bomb.HEIGHT, 'bomb');
  }

  update(deltaTime: number) {
    this.remainTime -= deltaTime;
    if (this.remainTime < 0) {
      //爆発
      // new Explosion();
    }
  }
}
