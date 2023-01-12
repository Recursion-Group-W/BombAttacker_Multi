import { RectBound } from '../../types/rectBound.type';
import { CommonConfig } from '../config/commonConfig';
import { ObjectUtil } from '../util/object.util';
import { GameObject } from './gameObject';
import { Obstacle } from './obstacle';

export class Character extends GameObject {
  static WIDTH = 32;
  static HEIGHT = 32;
  private spriteKey = '';

  protected direction = 2; // 0:up, 1:right, 2:down, 3:left
  protected speed = 50; // 速度[m/s]。1frameあたり5進む => 1/30[s] で5進む => 1[s]で150進む。
  protected initLife = 3;
  protected life = 3;
  protected animation: string | undefined = undefined;

  protected velocity = { x: 0, y: 0 };

  // 可動域
  protected rectField = ObjectUtil.calRectField(
    Character.WIDTH,
    Character.HEIGHT
  );
  //   private shouldUpdate = true

  // コンストラクタ
  constructor(
    public userName: string,
    obstacleSet: Set<Obstacle>
  ) {
    super(0.0, 0.0, Character.WIDTH, Character.HEIGHT);

    //初期位置に配置
    this.setInitialPosition(obstacleSet);
  }

  toJSON() {
    return Object.assign(super.toJSON(), {
      userName: this.userName,
      life: this.life,
    });
  }
  get getVelocity() {
    return this.velocity;
  }

  get getSpeed(): number {
    return this.speed;
  }
  get getDirection(): number {
    return this.direction;
  }
  get getLife(): number {
    return this.life;
  }
  get getInitLife(): number {
    return this.initLife;
  }
  get getRect(): RectBound {
    return this.rectField;
  }
  get getAnimation() {
    return this.animation;
  }

  setVelocity(x: number, y: number) {
    this.velocity = {
      x,
      y,
    };
  }

  set setSpeed(value: number) {
    this.speed = value;
  }
  set setDirection(value: number) {
    this.direction = value;
  }
  set setAnimation(value: string) {
    this.animation = value;
  }
  damage() {
    return this.life--;
  }

  //初期位置に配置するメソッド
  setInitialPosition(obstacleSet: Set<Obstacle>) {
    // 初期位置
    this.setPosition(
      Math.random() *
        (CommonConfig.FIELD_WIDTH - this.getWidth),
      Math.random() *
        (CommonConfig.FIELD_HEIGHT - this.getHeight)
    );

    // 障害物にぶつからない初期位置の算出
    do {
      this.setPosition(
        this.rectField.left +
          Math.random() *
            (this.rectField.right - this.rectField.left),
        this.rectField.bottom +
          Math.random() *
            (this.rectField.top - this.rectField.bottom)
      );
    } while (this.overlapObstacles(obstacleSet));
  }

  protected set setSpriteKey(key: string) {
    this.spriteKey = key;
  }
  protected move(deltaTime: number) {
    this.setPosition(
      this.getPosition.x + this.getVelocity.x * deltaTime,
      this.getPosition.y + this.getVelocity.y * deltaTime
    );
  }

  protected animWalkUp() {
    this.animation = `${this.spriteKey}-up`;
  }
  protected animWalkRight() {
    this.animation = `${this.spriteKey}-right`;
  }
  protected animWalkDown() {
    this.animation = `${this.spriteKey}-down`;
  }
  protected animTurnUp() {
    this.animation = `${this.spriteKey}-turn-up`;
  }
  protected animTurnRight() {
    this.animation = `${this.spriteKey}-turn-right`;
  }
  protected animTurnDown() {
    this.animation = `${this.spriteKey}-turn-down`;
  }
}
