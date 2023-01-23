import { Explosion } from './explosion';
import { GameObject } from './gameObject/gameObject';
import { Player } from './player/player';

export class Bomb extends GameObject {
  static readonly WIDTH = 31.5;
  static readonly HEIGHT = 31.5;
  private remainTime: number = 5;
  private animation: string = '';
  constructor(public id: number, x: number, y: number, public player: Player) {
    super(x, y, Bomb.WIDTH, Bomb.HEIGHT, 'bomb');
    this.setAnim();
  }

  public toJSON() {
    return Object.assign(super.toJSON(), {
      id: this.id,
      animation: this.animation,
    });
  }
  public update(deltaTime: number) {
    this.reduceRemainTime(deltaTime);
  }

  public get getRemainTime(): number {
    return this.remainTime;
  }

  public set setRemainTime(time: number) {
    this.remainTime = time;
  }

  private reduceRemainTime(time: number) {
    this.setRemainTime = this.getRemainTime - time;
  }

  // アニメーションをセット
  private setAnim() {
    this.animation = `${this.spriteKey}-anim`;
  }
}
