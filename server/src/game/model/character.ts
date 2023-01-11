import { RectField } from '../../types/rectBound.type';
import { GameObject } from './gameObject';
import { Obstacle } from './obstacle';

export class Character extends GameObject {
  private id: number = 0;
  private characterName: string = 'NoName';
  // private img: string;
  private speed: number = 0;
  // 0:up, 1:right, 2:down, 3:left
  private direction: number = 2;
  private lives: number = 0;

  constructor(
    private clientId: string,
    private userName: string,
    width: number,
    height: number,
    rectField: RectField,
    obstacleSet: Set<Obstacle>
  ) {
    super(
      width,
      height,
      0.0,
      0.0,
      Math.random() * 2 * Math.PI
    );
  }

  public get getId(): number {
    return this.id;
  }
  public set setId(id: number) {
    this.id = id;
  }
  public get getDirection(): number {
    return this.direction;
  }
  public get getSpeed(): number {
    return this.speed;
  }
  public get getLives(): number {
    return this.lives;
  }

  public set setSpeed(value: number) {
    this.speed = value;
  }
  public set setDirection(value: number) {
    this.direction = value;
  }

  public isAlive(): boolean {
    return this.lives >= 0;
  }
  public accelerate(value: number): void {
    this.setSpeed = this.getSpeed + value;
  }

  public reduceLife() {
    return this.lives--;
  }
}
