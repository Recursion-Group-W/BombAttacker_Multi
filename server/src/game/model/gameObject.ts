import { OverlapTester } from '../util/overlapTester';
import { Wall } from './wall';

export class GameObject {
  rectBound = {};
  constructor(
    public width: number,
    public height: number,
    public x: number,
    public y: number,
    public angle: number
  ) {
    this.setPos(x, y);
  }

  toJSON() {
    return {
      x: this.x,
      y: this.y,
      angle: this.angle,
    };
  }
  setPos(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.rectBound = {
      fLeft: x - this.width * 0.5,
      fBottom: y - this.height * 0.5,
      fRight: x + this.width * 0.5,
      fTop: y + this.height * 0.5,
    };
  }

  // 壁との干渉チェック
  overlapWalls(wallSet: Set<Wall>) {
    return Array.from(wallSet).some((wall) => {
      if (
        OverlapTester.overlapRects(
          this.rectBound,
          wall.rectBound
        )
      ) {
        return true;
      }
    });
  }
}
