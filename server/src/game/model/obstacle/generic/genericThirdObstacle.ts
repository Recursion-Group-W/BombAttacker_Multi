import { GenericSecondObstacle } from "./genericSecondObstacle";

export class GenericThirdObstacle extends GenericSecondObstacle {
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