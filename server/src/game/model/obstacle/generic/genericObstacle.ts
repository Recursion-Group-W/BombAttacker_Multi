import { GameObject } from '../../gameObject/gameObject';
import { Obstacle } from '../interface/obstacle.interface';

//将来の拡張に対応するためのGenericクラス
export class GenericObstacle extends GameObject implements Obstacle {
  static WIDTH = 40;
  static HEIGHT = 40;

  protected endurance = 0;

  // コンストラクタ
  constructor(
    public id: number,
    x: number,
    y: number,
    spriteKey: string,
    endurance: number
  ) {
    super(x, y, GenericObstacle.WIDTH, GenericObstacle.HEIGHT, spriteKey);
    this.endurance = endurance;
  }
  toJSON() {
    return Object.assign(super.toJSON(), {
      id: this.id,
    });
  }
  set setEndurance(value: number) {
    this.endurance = value;
  }
  damage() {
    return this.endurance--;
  }
}
