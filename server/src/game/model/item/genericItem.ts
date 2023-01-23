import { GameObject } from '../gameObject/gameObject';
import { Player } from '../player/player';
import { Item } from './interface/item.interface';

//将来の拡張に対応するためのGenericクラス
export class GenericItem extends GameObject implements Item {
  static WIDTH = 31.5;
  static HEIGHT = 31.5;

  // コンストラクタ
  constructor(public id: number, x: number, y: number, spriteKey: string) {
    super(x, y, GenericItem.WIDTH, GenericItem.HEIGHT, spriteKey);
  }
  toJSON() {
    return Object.assign(super.toJSON(), {
      id: this.id,
    });
  }
  //   update(
  //     explosionList: GenericLinkedList<Explosion>,

  //     roomManager: RoomManager,
  //     roomId: string
  //   ) {
  //     //爆風との干渉
  //     let explosion = this.overlapExplosions(explosionList);
  //     if (explosion) {
  //       //耐久力を減らす
  //       this.damage();
  //       //干渉した爆風を削除
  //       explosionList.remove(explosion);
  //       roomManager.ioNspGame.in(roomId).emit('destroyExplosion', {
  //         id: explosion.data.id,
  //       });
  //     }
  //   }
  effect(player: Player): void {}
}
