import { Position } from '../../types/position.type';
import { OverlapTester } from '../util/overlapTester';
import { Obstacle } from './obstacle';

export class GameObject {
  rectBound: { [key: string]: number } = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };
  position: Position = {
    x: 0,
    y: 0,
  };
  constructor(
    public width: number,
    public height: number,
    x: number,
    y: number,
    public angle: number
  ) {
    this.setPosition(x, y);
    this.setRectBound(x, y);
  }

  toJSON() {
    return {
      x: this.getPosition.x,
      y: this.getPosition.y,
      angle: this.angle,
    };
  }
  get getPosition() {
    return this.position;
  }

  setPosition(x: number, y: number) {
    this.position = {
      x,
      y,
    };
  }
  setRectBound(x: number, y: number) {
    this.rectBound = {
      left: x - this.width * 0.5,
      bottom: y - this.height * 0.5,
      right: x + this.width * 0.5,
      top: y + this.height * 0.5,
    };
  }

  // 障害物との干渉チェック
  overlapObstacles(wallSet: Set<Obstacle>) {
    //全ての障害物をチェックし、１つでも重なっているものがあればtrueを返す
    return Array.from(wallSet).some((wall) =>
      OverlapTester.overlapRects(
        this.rectBound,
        wall.rectBound
      )
    );
  }
}
