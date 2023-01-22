import { GameObject } from './gameObject/gameObject';
import { Player } from './player/player';
import { Bomb } from './bomb';
export class Explosion extends GameObject {
  static WIDTH = 38.4;
  static HEIGHT = 38.4;
  objects: { [key: string]: { [id: string]: any } } = {
    playerMap: {},
    npcMap: {},
    obstacleMap: {},
    bombMap: {},
    explosionMap: {} 
  };
  // private explosion = this.objects.explosionMap.create(
  //   this.player.getPosition.x,
  //   this.player.getPosition.y,
  //   'explode'
  // );

  // bombの座標は必要なはず？
  constructor(x: number, y: number, private bomb: Bomb, private player: Player) {
    super(x, y, Explosion.WIDTH, Explosion.HEIGHT, 'explosion');
  }
  
  updata(){
    let explosion: any;
    explosion = this.objects.explosionMap.create(
      this.player.getPosition.x,
      this.player.getPosition.y,
      'explosion'
    );
    explosion.create(
      this.bomb.getPosition.x + 32,
      this.bomb.getPosition.y,
      'explosion'
    );
    explosion.create(
      this.bomb.getPosition.x,
      this.bomb.getPosition.y + 32,
      'explosion'
    );
    explosion.create(
      this.bomb.getPosition.x - 32,
      this.bomb.getPosition.y,
      'explosion'
    );
    explosion.create(
      this.bomb.getPosition.x,
      this.bomb.getPosition.y - 32,
      'explosion'
    );
    explosion.playAnimation('explosion-anim');
  }
  // this.explosion = this.objects.explosionMap.create(
  //   this.player.getPosition.x,
  //   this.player.getPosition.y,
  //   'explode'
  // );
  // アニメーションを追加
  // protected animExplosion() {
  //   this.animation = `${this.spriteKey}-anim`;
  // }
}
