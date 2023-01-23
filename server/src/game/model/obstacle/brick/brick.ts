import { GenericLinkedList } from '../../../../linkedList/generic/genericLinkedList';
import RoomManager from '../../../../manager/roomManager';
import { Explosion } from '../../explosion';
import { GenericObstacle } from '../generic/genericObstacle';

export class Brick extends GenericObstacle {
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
    id: number,
    x: number,
    y: number,
    spriteKey: string,
    endurance: number
  ) {
    super(id, x, y, spriteKey, endurance);
  }

  update(
    explosionList: GenericLinkedList<Explosion>,

    roomManager: RoomManager,
    roomId: string
  ) {
    super.update(explosionList, roomManager, roomId);
  }
}
