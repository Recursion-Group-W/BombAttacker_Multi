import { GenericLinkedList } from '../../linkedList/generic/genericLinkedList';
import RoomManager from '../../manager/roomManager';
import { ObstacleFactory } from '../factory/obstacle/interface/obstacleFactory.interface';
import { Npc } from '../model/npc/npc';
import { GenericObstacle } from '../model/obstacle/generic/genericObstacle';
import { Player } from '../model/player/player';
import { MathUtil } from '../util/math.util';

export class Stage {
  readonly TILE_SIZE = 40;
  readonly TILE_SPAN_SCALE = 1.0;
  // obstacleSet = new Set<GenericObstacle>();
  playerSet = new Set<Player>(); //とりあえずSetを使う。あとでDequeを使って修正したい。
  // npcSet = new Set<Npc>();
  npcList = new GenericLinkedList<Npc>();
  obstacleList = new GenericLinkedList<GenericObstacle>();

  constructor(
    public level: number,
    public roomId: string,
    public roomManager: RoomManager
  ) {}

  // 更新処理
  update(deltaTime: number) {
    // // オブジェクトの座標値の更新
    // this.updateObjects(deltaTime);
    // // 衝突チェック
    // this.checkCollisions();
    // // 新たな行動（特に、ボットに関する生成や動作
    // this.doNewActions(deltaTime);
  }
  //障害物の生成
  createObstacles(
    stageWidth: number,
    stageHeight: number,
    obstacleFactory: ObstacleFactory
  ) {
    if (!obstacleFactory) return;

    //ステージ余白を均等にするために、余白extraを算出
    const extra = Math.floor(
      (stageWidth % (this.TILE_SIZE * this.TILE_SPAN_SCALE)) / 2
    );
    for (
      let i = 0;
      i < Math.floor(stageWidth / this.TILE_SIZE / this.TILE_SPAN_SCALE);
      i++
    ) {
      for (
        let j = 0;
        j < Math.floor(stageHeight / this.TILE_SIZE / this.TILE_SPAN_SCALE);
        j++
      ) {
        const x =
          i * this.TILE_SIZE * this.TILE_SPAN_SCALE +
          this.TILE_SIZE * 0.5 +
          extra;
        const y =
          j * this.TILE_SIZE * this.TILE_SPAN_SCALE +
          this.TILE_SIZE * 0.5 +
          extra;

        //後で双方向リストに書き換えて計算量減らしたい
        // const obstacleArr = Array.from(this.obstacleSet);
        // const id =
        //   obstacleArr.length <= 0
        //     ? 0
        //     : obstacleArr[obstacleArr.length - 1].id + 1;

        const tail = this.obstacleList.peekBack();
        const id = tail ? tail.id + 1 : 0;

        let obstacle = null;

        if (i % 2 !== 0 && j % 2 !== 0) {
          //耐久力の高い障害物を置く
          obstacle = obstacleFactory.createFourthObstacle(id, x, y);
        } else {
          //耐久力の低い障害物を置く
          // 1/5の確率で置く
          const willPut = MathUtil.getRandomInt(0, 4);
          if (willPut >= 1) continue;

          //障害物の種類をランダムに決定
          const obstacleLevel = MathUtil.getRandomInt(1, 3);

          switch (obstacleLevel) {
            case 3:
              obstacle = obstacleFactory.createThirdObstacle(id, x, y);
              break;
            case 2:
              obstacle = obstacleFactory.createSecondObstacle(id, x, y);
              break;
            case 1:
              obstacle = obstacleFactory.createFirstObstacle(id, x, y);
              break;
          }
        }
        // if (obstacle) this.obstacleSet.add(obstacle);
        if (obstacle) this.obstacleList.pushBack(obstacle);
      }
    }
  }

  createNpcs(
    npcList: GenericLinkedList<Npc>,
    obstacleList: GenericLinkedList<GenericObstacle>,
    count: number
  ) {
    for (let i = 0; i < count; i++) {
      this.createNpc(npcList, obstacleList);
    }
  }

  createNpc(
    npcList: GenericLinkedList<Npc>,
    obstacleList: GenericLinkedList<GenericObstacle>
  ) {
    
    const tail = npcList.getTail();
    const id = tail ? tail.data.id + 1 : 0;
    const npc = new Npc(id, obstacleList);

    npcList.pushBack(npc);
    return npc;
  }
  // createNpcs(
  //   npcSet: Set<Npc>,
  //   obstacleList:GenericLinkedList<GenericObstacle>,
  //   count: number
  // ) {
  //   for (let i = 0; i < count; i++) {
  //     this.createNpc(npcSet, obstacleList);
  //   }
  // }

  // createNpc(npcSet: Set<Npc>, obstacleList:GenericLinkedList<GenericObstacle>) {
  //   const npcArr = Array.from(npcSet);
  //   const id = npcArr.length === 0 ? 0 : npcArr[npcArr.length - 1].id + 1;
  //   const npc = new Npc(id, obstacleList);

  //   npcSet.add(npc);
  //   return npc;
  // }
}
