import { GenericFirstObstacle } from '../generic/genericFirstObstacle';

export class FirstBrick extends GenericFirstObstacle {
  type = 'brick';
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
