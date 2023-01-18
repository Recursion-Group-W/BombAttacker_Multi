import { SecondObstacle } from '../interface/secondObstacle.interface';
import { GenericFirstObstacle } from './genericFirstObstacle';

export class GenericSecondObstacle extends GenericFirstObstacle implements SecondObstacle{
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
