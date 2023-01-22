import { FourthObstacle } from '../interface/fourthObstacle.interface';
import { GenericThirdObstacle } from './genericThirdObstacle';

export class GenericFourthObstacle
  extends GenericThirdObstacle
  implements FourthObstacle
{
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
