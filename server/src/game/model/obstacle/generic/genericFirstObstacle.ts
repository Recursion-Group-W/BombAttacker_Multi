import { FirstObstacle } from '../interface/firstObstacle.interface';
import { GenericObstacle } from './genericObstacle';

export class GenericFirstObstacle extends GenericObstacle implements FirstObstacle{
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
