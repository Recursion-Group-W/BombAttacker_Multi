import { GenericLinkedList } from '../../linkedList/generic/genericLinkedList';
import { GameObject } from './gameObject/gameObject';
import { Npc } from './npc/npc';
import { GenericObstacle } from './obstacle/generic/genericObstacle';
import { Player } from './player/player';
export class Explosion extends GameObject {
  static WIDTH = 31.5;
  static HEIGHT = 31.5;
  private animation: string = '';
  private remainTime: number = 1;

  // bombの座標は必要なはず？
  constructor(public id: number, x: number, y: number, public player: Player) {
    super(x, y, Explosion.WIDTH, Explosion.HEIGHT, 'explosion');
    this.setAnim();
  }
  public toJSON() {
    return Object.assign(super.toJSON(), {
      id: this.id,
      animation: this.animation,
    });
  }

  // アニメーションをセット
  private setAnim() {
    this.animation = `${this.spriteKey}-anim`;
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
}
