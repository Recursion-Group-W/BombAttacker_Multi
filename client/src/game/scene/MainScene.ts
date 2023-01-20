import { BombDto } from '../dto/bomb.dto';
import { NpcDto } from '../dto/npc.dto';
import { ObstacleDto } from '../dto/obstacle.dto';
import { PlayerDto } from '../dto/player.dto';
import Cursor from '../model/cursor';
import { SyncUtil } from '../util/sync.util';
import { CustomScene } from './parent/customScene';

export class MainScene extends CustomScene {
  cursor: Cursor | null = null;

  constructor() {
    super({ key: 'MainScene' });
  }

  init() {
    this.socket = this.registry.get('socket');
    if (this.socket) {
      this.cursor = new Cursor(this, this.socket);
    }
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
        bombArr: BombDto[];
      }) => {
        SyncUtil.setPlayer(res.playerArr, this);
        SyncUtil.setNpc(res.npcArr, this);
        SyncUtil.setObstacle(res.obstacleArr, this);
        SyncUtil.setBomb(res.bombArr, this);
      }
    );

    this.socket.on('destroyBomb', (res: { id: number }) => {
      SyncUtil.destroyBomb(res.id, this);
    });

    this.socket.on('destroyPlayer', (res: { clientId: string }) => {
      SyncUtil.destroyPlayer(res.clientId, this);
    });
  }
  update(): void {
    //syncのデータを基に、spriteの座標とアニメーションを更新
    SyncUtil.updatePlayer(this);
    SyncUtil.updateNpc(this);
    SyncUtil.updateBomb(this);

    this.cursor?.update();
  }
}
