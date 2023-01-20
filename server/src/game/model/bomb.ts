import { Explosion } from './explosion';
import { GameObject } from './gameObject/gameObject';
import { Player } from './player/player';

export class Bomb extends GameObject {
  static WIDTH = 38.4;
  static HEIGHT = 38.4;
  private bombExisted: boolean;
  private remainTime: number = 5;
  // private bombs: Phaser.GameObjects.Group;
  // private bombLog: {
  //   x: number;
  //   y: number;
  //   existed: boolean;
  // };
  // private obj = GameObject;
  objects: { [key: string]: { [id: string]: any } } = {
    playerMap: {},
    npcMap: {},
    obstacleMap: {},
    bombMap: {},
    explosionMap: {} 
  };
  constructor(x: number, y: number, private player: Player) {
    // 親クラスのコンストラクタ呼び出し
    super(x, y, Bomb.WIDTH, Bomb.HEIGHT, 'bomb');
    // 1/20
    this.bombExisted = false
  }

  update(deltaTime: number) {
    this.remainTime -= deltaTime;
    if (this.remainTime < 0) {
      //爆発
      // new Explosion();
    }

    let bomb: any;
    if (this.player.putBomb()) {
      if (
        this.getPosition.x != this.player.getPosition.x ||
        this.getPosition.y != this.player.getPosition.y ||
        !this.bombExisted
      ) {
        // bomb Map呼び出し方がわからない
        bomb = this.objects.bombMap.create(
          this.player.getPosition.x,
          this.player.getPosition.y,
          'bomb'
        );
        this.bombExisted = true;
        // this.player.decreaseBombCounter();
        bomb.anims.play('bomb-anim', true);

        setTimeout(() => {
          // bomb.xは何のこと？
          this.setPosition(bomb.x, bomb.y);
          // this.setPosition = bomb.y;
          bomb.destroy();
          this.bombExisted= false;
          // this.player.increaseBombCounter();
          setTimeout(() => {
            this.explosion.clear(true, true);
            this.player.setHit = false;
          }, 600);
        }, 2000);

        }
    }

  }
  // アニメーションを追加
  protected animBomb() {
    this.animation = `${this.spriteKey}-anim`;
  }
}
