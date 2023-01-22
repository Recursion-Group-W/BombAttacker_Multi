import { RectBound } from '../../types/rectBound.type';
import { CommonConfig } from '../../config/commonConfig';
import { ObjectUtil } from '../../util/object.util';
import { GameObject } from '../gameObject/gameObject';
import { GenericObstacle } from '../obstacle/generic/genericObstacle';
import { GenericLinkedList } from '../../../linkedList/generic/genericLinkedList';
import { Bomb } from '../bomb';
import { OverlapUtil } from '../../util/overlap.util';

export class Character extends GameObject {
  static WIDTH = 38.4;
  static HEIGHT = 38.4;

  protected direction = 2; // 0:up, 1:right, 2:down, 3:left
  protected speed = 50; // 速度[m/s]。1frameあたり5進む => 1/30[s] で5進む => 1[s]で150進む。
  protected initLife = 3;
  protected life = 3;
  protected animation: string | undefined = undefined;

  protected velocity = { x: 0, y: 0 };

  private isJustPutBomb = false; //爆弾を置いたばかりかどうか。爆弾とプレイヤーの当たり判定で使用

  // 可動域
  protected rectField = ObjectUtil.calRectField(
    Character.WIDTH,
    Character.HEIGHT
  );

  // コンストラクタ
  constructor(
    public userName: string,
    spriteKey: string,
    obstacleList: GenericLinkedList<GenericObstacle>
  ) {
    super(0.0, 0.0, Character.WIDTH, Character.HEIGHT, spriteKey);

    //初期位置に配置
    this.setInitialPosition(obstacleList);
  }

  toJSON() {
    return Object.assign(super.toJSON(), {
      userName: this.userName,
      life: this.life,
      direction: this.direction,
      animation: this.animation,
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
  get getIsJustPutBomb(): boolean {
    return this.isJustPutBomb;
  }

  set setIsJustPutBomb(value: boolean) {
    this.isJustPutBomb = value;
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
    console.log('ダメージを受けました');
    this.life--;
  }

  //初期位置に配置するメソッド
  setInitialPosition(obstacleList: GenericLinkedList<GenericObstacle>) {
    // 初期位置
    this.setPosition(
      Math.random() * (CommonConfig.STAGE_WIDTH - this.getWidth),
      Math.random() * (CommonConfig.STAGE_HEIGHT - this.getHeight)
    );

    // 障害物にぶつからない初期位置の算出
    do {
      this.setPosition(
        this.rectField.left +
          Math.random() * (this.rectField.right - this.rectField.left),
        this.rectField.bottom +
          Math.random() * (this.rectField.top - this.rectField.bottom)
      );
    } while (this.overlapObstacles(obstacleList));
  }

  protected move(deltaTime: number) {
    this.setPosition(
      this.getPosition.x + this.getVelocity.x * deltaTime,
      this.getPosition.y + this.getVelocity.y * deltaTime
    );
  }

  // 爆弾との干渉チェック
  overlapBombs(bombList: GenericLinkedList<Bomb>) {
    let iterator = bombList.getHead();
    while (iterator !== null) {
      if (OverlapUtil.overlapRects(this.rectBound, iterator.data.rectBound)) {
        return iterator;
      }
      iterator = iterator.next;
    }

    //置いたばかりの爆弾とのoverlapがなくなったので、falseに設定する
    this.setIsJustPutBomb = false;
    return null;
  }

  //アニメーションを設定するメソッド
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
