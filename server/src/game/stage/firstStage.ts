import RoomManager from '../../manager/roomManager';
import { Stage } from './stage';

export class FirstStage extends Stage {
  readonly STAGE_WIDTH = 1160;
  readonly STAGE_HEIGHT = 1160;
  readonly NPC_COUNT = 10;
  constructor(level: number, roomId: string, roomManager: RoomManager) {
    super(level, roomId, roomManager);
  }

  // 更新処理
  update(deltaTime: number) {
    super.update(deltaTime);

    // 新たな行動（特に、ボットに関する生成や動作)
    this.doNewActions(deltaTime);
  }

  // 新たな行動
  //特定の条件で敵の動きを変化させる(一定時間経ったら敵を追跡モードに変化させるとか)
  doNewActions(deltaTime: number) {
    // // ボットは、新たな弾丸を打つかも
    // this.botSet.forEach((bot) => {
    //   if (
    //     ServerConfig.BOTTANK_SHOOT_PROBABILITY_PER_SEC *
    //       deltaTime >
    //     Math.random()
    //   ) {
    //     // 1秒でN発の発射確率で発射する。（N = GameSettings.BOTTANK_SHOOT_PROBABILITY_PER_SEC）
    //     this.createBullet(bot.clientId, bot.id);
    //   }
    // });
  }
}
