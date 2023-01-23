import { GenericLinkedList } from '../../../../linkedList/generic/genericLinkedList';
import RoomManager from '../../../../manager/roomManager';
import { Explosion } from '../../explosion';
import { GameObject } from '../../gameObject/gameObject';
import { GenericItem } from '../../item/genericItem';
import { Obstacle } from '../interface/obstacle.interface';

//将来の拡張に対応するためのGenericクラス
export class GenericObstacle extends GameObject implements Obstacle {
  static WIDTH = 32;
  static HEIGHT = 32;

  protected endurance = 0;

  item: GenericItem | null = null;

  readonly BrickMap = {
    orange: {
      spriteKey: 'orangeBrick',
      endurance: 1,
    },
    green: {
      spriteKey: 'greenBrick',
      endurance: 2,
    },
    blue: {
      spriteKey: 'blueBrick',
      endurance: 3,
    },
    gray: {
      spriteKey: 'grayBrick',
      endurance: 4,
    },
  };

  // コンストラクタ
  constructor(
    public id: number,
    x: number,
    y: number,
    spriteKey: string,
    endurance: number
  ) {
    super(x, y, GenericObstacle.WIDTH, GenericObstacle.HEIGHT, spriteKey);
    this.endurance = endurance;
  }
  toJSON() {
    return Object.assign(super.toJSON(), {
      id: this.id,
    });
  }
  update(
    explosionList: GenericLinkedList<Explosion>,

    roomManager: RoomManager,
    roomId: string
  ) {
    //爆風との干渉
    let explosion = this.overlapExplosions(explosionList);
    if (explosion) {
      //耐久力を減らす
      this.damage();
      //干渉した爆風を削除
      explosionList.remove(explosion);
      roomManager.ioNspGame.in(roomId).emit('destroyExplosion', {
        id: explosion.data.id,
      });
    }
  }

  get getEndurance(): number {
    return this.endurance;
  }
  set setEndurance(value: number) {
    this.endurance = value;
  }
  damage() {
    this.endurance--;
  }
}
