import { NpcDto } from '../dto/npc.dto';
import { ObstacleDto } from '../dto/obstacle.dto';
import { PlayerDto } from '../dto/player.dto';
import { SyncUtil } from '../util/sync.util';
import { CustomScene } from './parent/customScene';

export class MainScene extends CustomScene {
  constructor() {
    super({ key: 'MainScene' });
  }

  init() {
    this.socket = this.registry.get('socket');
  }

  create() {
    if (!this.socket) return;

    this.socket.emit('getInitialState');

    this.socket.on(
      'syncGame',
      (res: {
        playerArr: PlayerDto[];
        npcArr: NpcDto[];
        obstacleArr: ObstacleDto[];
      }) => {
        SyncUtil.setPlayer(res.playerArr, this);
        SyncUtil.setNpc(res.npcArr, this);
        SyncUtil.setObstacle(res.obstacleArr, this);
      }
    );
  }

  update(): void {
    //syncのデータを基に、spriteの座標とアニメーションを更新
    SyncUtil.updatePlayer(this);
    SyncUtil.updateNpc(this);
  }
}
