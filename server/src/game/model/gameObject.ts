import { Position } from '../../types/position.type';
import { RectBound } from '../../types/rectBound.type';
import { OverlapTester } from '../util/overlapTester';
import { Obstacle } from './obstacle';

export class GameObject {
  rectBound: RectBound = {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  };
  constructor(
    private x: number,
    private y: number,
    private width: number,
    private height: number
  ) {
    this.setPosition(x, y);
  }

  toJSON() {
    return {
      x: this.getPosition.x,
      y: this.getPosition.y,
    };
  }
  get getWidth() {
    return this.width;
  }
  get getHeight() {
    return this.height;
  }
  get getPosition(): Position {
    return { x: this.x, y: this.y };
  }
  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.setRectBound(x, y);
  }

  private setRectBound(x: number, y: number) {
    this.rectBound = {
      left: x - this.width * 0.5,
      bottom: y - this.height * 0.5,
      right: x + this.width * 0.5,
      top: y + this.height * 0.5,
    };
  }

  // 壁との干渉チェック
  overlapObstacles(obstacleSet: Set<Obstacle>) {
    return Array.from(obstacleSet).some((obstacle) => {
      if (
        OverlapTester.overlapRects(
          this.rectBound,
          obstacle.rectBound
        )
      ) {
        return true;
      }
    });
  }
}
