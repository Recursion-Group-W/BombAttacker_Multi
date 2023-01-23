import { GenericFourthObstacle } from "../generic/genericFourthObstacle";

export class FourthBrick extends GenericFourthObstacle {
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
    //   this.setSpriteKey = this.BrickMap.blue.spriteKey;
    // }
  }