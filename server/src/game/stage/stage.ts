import RoomManager from '../../manager/roomManager';
import { GenericObstacle } from '../model/obstacle/generic/genericObstacle';
import { Player } from '../model/player/player';
import { BotTank } from '../model/tank/botTank';
import { Bullet } from '../model/tank/bullet';
import { Tank } from '../model/tank/tank';
import { TankObstacle } from '../model/tank/tankObstacle';

export class Stage {
  readonly TILE_SIZE = 32;
  readonly TILE_SPAN_SCALE = 1.25;
  obstacleSet = new Set<GenericObstacle>();
  playerSet = new Set<Player>(); //とりあえずSetを使う。あとでDequeを使って修正したい。

  tankSet = new Set<Tank>();
  tankobstacleSet = new Set<TankObstacle>();
  bulletSet = new Set<Bullet>();
  botSet = new Set<BotTank>();
  botId: number = 0;
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

}
