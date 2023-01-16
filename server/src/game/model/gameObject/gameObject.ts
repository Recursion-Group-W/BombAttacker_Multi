import { Position } from '../../../types/position.type';
import { RectBound } from '../../../types/rectBound.type';
import { OverlapTester } from '../../util/overlapTester';
import { GenericObstacle } from '../obstacle/generic/genericObstacle';

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
    private height: number,
    protected spriteKey: string
  ) {
    this.setPosition(x, y);
  }

  toJSON() {
    return {
      x: this.getPosition.x,
      y: this.getPosition.y,
      spriteKey: this.spriteKey,
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
  protected set setSpriteKey(key: string) {
    this.spriteKey = key;
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
  overlapObstacles(obstacleSet: Set<GenericObstacle>) {
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
