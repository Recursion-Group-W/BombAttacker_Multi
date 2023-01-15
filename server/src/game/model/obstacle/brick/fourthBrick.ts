import { FourthObstacle } from "../generic/genericFourthObstacle";

export class FourthBrick extends FourthObstacle {
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