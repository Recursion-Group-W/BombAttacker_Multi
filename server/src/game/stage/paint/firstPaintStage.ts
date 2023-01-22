import RoomManager from '../../../manager/roomManager';
import { FirstStage } from '../generic/genericFirstStage';
import { BrickFactory } from '../../factory/obstacle/brick/brickFactory';

export class FirstPaintStage extends FirstStage {
  type = 'paint';
  // background = ""
  obstacleFactory = new BrickFactory(); //障害物(レンガ)を作成するFactory

  constructor(level: number, roomId: string, roomManager: RoomManager) {
    super(level, roomId, roomManager);

    //障害物の生成
    this.createObstacles(
      this.STAGE_WIDTH,
      this.STAGE_HEIGHT,
      this.obstacleFactory
    );
    // console.log(this.squareCache[5].length);

    //npc作成
    //後でfactoryを作成して、npc作成の機能をステージから切り離したい
    this.createNpcs(this.npcList, this.obstacleList, this.NPC_COUNT);
  }

  // 更新処理
  update(deltaTime: number) {
    super.update(deltaTime);
  }


  //次のステージへ移動するメソッド
  // nextStage(){
  //     GameManager.switchStage(this.stageFactory.secondStage(),  this.playerSet)
  // }
}
