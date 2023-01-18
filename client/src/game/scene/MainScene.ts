import { NpcDto } from '../dto/npc.dto';
import { ObstacleDto } from '../dto/obstacle.dto';
import { PlayerDto } from '../dto/player.dto';
import Cursor from '../model/cursor';
import { SyncUtil } from '../util/sync.util';
import { CustomScene } from './parent/customScene';

export class MainScene extends CustomScene {
  cursor: Cursor | null = null;
  
  // public socket: any;

  // objects: { [key: string]: { [id: string]: any } } = {
  //   playerMap: {},
  //   npcMap: {},
  //   obstacleMap: {},
  //   bombMap: {}
  // };

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
        // bombの配列を追加
        bombArr: any[]
      }) => {
        SyncUtil.setPlayer(res.playerArr, this);
        SyncUtil.setNpc(res.npcArr, this);
        SyncUtil.setObstacle(res.obstacleArr, this);
        // 1/18
        // if (res.bombArr.length > 0) {
        //   res.bombArr.map((obstacle) => {
        //     if (!this.objects.bombMap[obstacle.id]) {
        //       let sprite = this.add
        //         .sprite(
        //           obstacle.x,
        //           obstacle.y,
        //           obstacle.spriteKey
        //         )
        //         .setOrigin(0.5);
        //       this.objects.bombMap[obstacle.id] = {
        //         sprite: sprite,
        //       };
        //     }
        //     this.objects.bombMap[obstacle.id]['sync'] =
        //       obstacle;
        //   });
        // }

      }
    );
  }
  update(): void {
    //syncのデータを基に、spriteの座標とアニメーションを更新
    SyncUtil.updatePlayer(this);
    SyncUtil.updateNpc(this);

    this.cursor?.update();
  }
}
