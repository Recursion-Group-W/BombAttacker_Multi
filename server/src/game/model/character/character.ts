import { RectBound } from '../../types/rectBound.type';
import { CommonConfig } from '../../config/commonConfig';
import { ObjectUtil } from '../../util/object.util';
import { GameObject } from '../gameObject/gameObject';
import { GenericObstacle } from '../obstacle/generic/genericObstacle';
import { GenericLinkedList } from '../../../linkedList/generic/genericLinkedList';
import { Bomb } from '../bomb';
import { OverlapUtil } from '../../util/overlap.util';
import { Explosion } from '../explosion';

export class Character extends GameObject {
  static WIDTH = 29;
  static HEIGHT = 29;

  protected direction = 2; // 0:up, 1:right, 2:down, 3:left
  protected speed = 50; // 速度[m/s]。1frameあたり5進む => 1/30[s] で5進む => 1[s]で150進む。
  protected initLife = 3;
  protected life = 3;
  protected animation: string | undefined = undefined;

  protected velocity = { x: 0, y: 0 };

  private isJustPutBomb = false; //爆弾を置いたばかりかどうか。爆弾とプレイヤーの当たり判定で使用

  private noDamageTime = 0;

  // 可動域
  protected rectField: RectBound | null = null;

  // コンストラクタ
  constructor(
    x: number,
    y: number,
    spriteKey: string,
    obstacleList: GenericLinkedList<GenericObstacle>,
    stageWidth: number,
    stageHeight: number
  ) {
    super(x, y, Character.WIDTH, Character.HEIGHT, spriteKey);

    //可動域を設定
    this.rectField = ObjectUtil.calRectField(
      Character.WIDTH,
      Character.HEIGHT,
      stageWidth,
      stageHeight
    );
    // //初期位置に配置
    // this.setInitialPosition(obstacleList, stageWidth, stageHeight);
  }

  toJSON() {
    return Object.assign(super.toJSON(), {
      life: this.life,
      initLife: this.initLife,
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
  get getRectField(): RectBound | null {
    return this.rectField;
  }
  get getAnimation() {
    return this.animation;
  }
  get getIsJustPutBomb(): boolean {
    return this.isJustPutBomb;
  }
  get getNoDamageTime() {
    return this.noDamageTime;
  }

  set setNoDamageTime(value: number) {
    this.noDamageTime = value;
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

  set setLife(value: number) {
    this.life = value;
  }
  set setInitLife(value: number) {
    this.initLife = value;
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
  setInitialPosition(
    obstacleList: GenericLinkedList<GenericObstacle>,
    stageWidth: number,
    stageHeight: number
  ) {
    const tileSize = 32;
    if (!this.getRectField) return;
    // 初期位置
    this.setPosition(
      Math.random() * (stageWidth - this.getWidth - tileSize * 3) +
        tileSize * 1.5,
      Math.random() * (stageHeight - this.getHeight - tileSize * 3) +
        tileSize * 1.5
    );

    // 障害物にぶつからない初期位置の算出
    do {
      this.setPosition(
        this.getRectField.left +
          tileSize * 1.5 +
          Math.random() *
            (this.getRectField.right - this.getRectField.left - tileSize * 3),
        this.getRectField.bottom +
          tileSize * 1.5 +
          Math.random() *
            (this.getRectField.top - this.getRectField.bottom - tileSize * 3)
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
