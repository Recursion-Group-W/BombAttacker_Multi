import { GenericThirdObstacle } from '../generic/genericThirdObstacle';

export class ThirdBrick extends GenericThirdObstacle {
  constructor(
    id: number,
    x: number,
    y: number,
    spriteKey: string,
    endurance: number
  ) {
    super(id, x, y, spriteKey, endurance);
  }
}
