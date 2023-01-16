import { GameObject } from '../../gameObject/gameObject';

//将来の拡張に対応するためのGenericクラス
export class GenericObstacle extends GameObject {
  id = 0;
  static WIDTH = 40;
  static HEIGHT = 40;

  protected endurance = 0;

  // コンストラクタ
  constructor(
    id: number,
    x: number,
    y: number,
    spriteKey: string,
    endurance: number
  ) {
    super(
      x,
      y,
      GenericObstacle.WIDTH,
      GenericObstacle.HEIGHT,
      spriteKey
    );
    this.id = id;
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
