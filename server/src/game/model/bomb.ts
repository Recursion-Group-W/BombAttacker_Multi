import { Explosion } from './explosion';
import { GameObject } from './gameObject/gameObject';
import { Player } from './player/player';

export class Bomb extends GameObject {
  static readonly WIDTH = 31.5;
  static readonly HEIGHT = 31.5;
  private remainTime: number = 5;
  private animation: string = 'bomb-anim';
  constructor(public id: number, x: number, y: number, public player: Player) {
    super(x, y, Bomb.WIDTH, Bomb.HEIGHT, 'bomb');
  }

  toJSON() {
    return Object.assign(super.toJSON(), {
      id: this.id,
      animation: this.animation,
    });
  }

  public get getRemainTime(): number {
    return this.remainTime;
  }

  public set setRemainTime(time: number) {
    this.remainTime = time;
  }

  public reduceRemainTime(time: number) {
    this.setRemainTime = this.getRemainTime - time;
  }

  update(deltaTime: number) {
    this.remainTime -= deltaTime;
    if (this.remainTime <= 0) {
      //爆発
      // new Explosion();
    }
  }
  // }

  // }
  // アニメーションを追加
  protected animBomb() {
    this.animation = `${this.spriteKey}-anim`;
  }
}
