import { Position } from '../../../types/position.type';
import { RectBound } from '../../../types/rectBound.type';
import { OverlapTester } from '../../util/overlapTester';
import { TankObstacle } from './tankObstacle';

export class TankGameObject {
  rectBound: RectBound = {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  };
  constructor(
    private width: number,
    private height: number,
    private x: number,
    private y: number,
    public angle: number
  ) {
    this.setPosition(x, y);
  }

  toJSON() {
    return {
      x: this.x,
      y: this.y,
      angle: this.angle,
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

  setRectBound(x: number, y: number) {
    this.rectBound = {
      left: x - this.width * 0.5,
      bottom: y - this.height * 0.5,
      right: x + this.width * 0.5,
      top: y + this.height * 0.5,
    };
  }

  // 壁との干渉チェック
  overlapObstacles(obstacleSet: Set<TankObstacle>) {
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
