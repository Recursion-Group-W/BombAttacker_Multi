import { GenericThirdObstacle } from "./genericThirdObstacle";

export class FourthObstacle extends GenericThirdObstacle {
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