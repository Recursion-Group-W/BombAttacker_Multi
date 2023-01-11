import { RectBound } from '../../types/rectBound.type';
import { OverlapTester } from '../util/overlapTester';
import { Wall } from './wall';

export class GameObject {
  rectBound: RectBound = {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  };
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
      left: x - this.width * 0.5,
      bottom: y - this.height * 0.5,
      right: x + this.width * 0.5,
      top: y + this.height * 0.5,
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
