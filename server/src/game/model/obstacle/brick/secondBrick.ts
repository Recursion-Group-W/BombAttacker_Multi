import { GenericSecondObstacle } from '../generic/genericSecondObstacle';

export class SecondBrick extends GenericSecondObstacle {
  constructor(
    id: number,
    x: number,
    y: number,
    spriteKey: string,
    endurance: number
  ) {
    super(id, x, y, spriteKey, endurance);
  }
  // public damage() {
  //   this.endurance--;
  //   this.setSpriteKey = this.BrickMap.orange.spriteKey;
  // }
}
