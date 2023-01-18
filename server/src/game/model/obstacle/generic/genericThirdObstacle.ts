import { ThirdObstacle } from "../interface/thirdObstacle.interface";
import { GenericSecondObstacle } from "./genericSecondObstacle";

export class GenericThirdObstacle extends GenericSecondObstacle implements ThirdObstacle{
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