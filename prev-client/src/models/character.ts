type Position = {
  x: number;
  y: number;
};

interface GameObject {
  //   getName(): string;
  get getDirection(): number; //向きを取得
  get getPosition(): Position; //位置を取得
  get getSpeed(): number; //速さを取得
  get getLives(): number; //残機の数
  get getHit(): boolean;
  set setDirection(value: number); //向きを設定
  set setSpeed(value: number); //速さを設定
  set setHit(value: boolean);
  isAlive(): boolean; //残機があるかどうか
  accelerate(value: number): void; //加速
}

export class Character
  extends Phaser.Physics.Arcade.Sprite
  implements GameObject
{
  private id = 0;
  private characterName = "NoName";
  // private img: string;
  private speed = 0;
  // 0:up, 1:right, 2:down, 3:left
  private direction = 2;
  protected lives;
  protected hit = false;

  constructor(
    params: {
      scene: Phaser.Scene;
      x: number;
      y: number;
    },
    type: string,
    lives: number,
  ) {
    super(params.scene, params.x, params.y, type);
    this.lives = lives;
  }

  public get getID():number{
    return this.id;
  }
  public set setID(ID:number){
    this.id = ID;
  }
  public get getDirection():number {
    return this.direction;
  }
  public get getPosition(): Position {
    return { x: this.x, y: this.y };
  }
  public get getSpeed(): number {
    return this.speed;
  }
  public get getLives(): number {
    return this.lives;
  }
  public get getHit(): boolean {
    return this.hit;
  }

  public set setSpeed(value: number) {
    this.speed = value;
  }
  public set setDirection(value: number) {
    this.direction = value;
  }
  public set setHit(value: boolean) {
    this.hit = value;
  }
  
  public isAlive(): boolean {
    return this.lives >= 0;
  }
  public accelerate(value: number): void {
    this.setSpeed = this.getSpeed + value;
  }

  public reduceLife() {
    this.lives--;
    return this.lives;
  }
}
