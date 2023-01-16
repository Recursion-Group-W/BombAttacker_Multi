import { Scene } from 'phaser';
import { CustomSocket } from '../../socket/interface/customSocket.interface';
import { NpcDto } from '../dto/npc.dto';
import { ObstacleDto } from '../dto/obstacle.dto';
import { PlayerDto } from '../dto/player.dto';
import { Objects } from '../types/objects.type';
import { AnimationUtil } from '../util/animationUtil';

export class MainScene extends Scene {
  public socket: CustomSocket | null = null;

  objects: Objects = {
    playerMap: {},
    npcMap: {},
    obstacleMap: {},
  };

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
        if (res.playerArr && res.playerArr.length > 0) {
          res.playerArr.forEach((player) => {
            //clientIdに対応するデータがない場合、新たにspriteを作成する
            if (!this.objects.playerMap[player.clientId]) {
              let sprite = this.add
                .sprite(
                  player.x,
                  player.y,
                  player.spriteKey
                )
                .setOrigin(0.5)
                .setScale(1.2);
              this.objects.playerMap[player.clientId] = {
                sprite: sprite,
                sync: null,
              };
            }
            //updateメソッドで使用するためのデータをsyncに格納する
            this.objects.playerMap[player.clientId][
              'sync'
            ] = player;
          });
        }

        if (res.npcArr && res.npcArr.length > 0) {
          res.npcArr.forEach((npc) => {
            if (!this.objects.npcMap[npc.id]) {
              let sprite = this.add
                .sprite(npc.x, npc.y, npc.spriteKey)
                .setOrigin(0.5)
                .setScale(1.2);
              this.objects.npcMap[npc.id] = {
                sprite: sprite,
                sync: null,
              };
            }
            this.objects.npcMap[npc.id]['sync'] = npc;
          });
        }
        if (res.obstacleArr && res.obstacleArr.length > 0) {
          res.obstacleArr.map((obstacle) => {
            if (!this.objects.obstacleMap[obstacle.id]) {
              let sprite = this.add
                .sprite(
                  obstacle.x,
                  obstacle.y,
                  obstacle.spriteKey
                )
                .setOrigin(0.5)
                .setScale(1.25);
              this.objects.obstacleMap[obstacle.id] = {
                sprite: sprite,
                sync: null,
              };
            }
            this.objects.obstacleMap[obstacle.id]['sync'] =
              obstacle;
          });
        }
      }
    );
  }

  update(): void {
    //syncのデータを基に、spriteの座標とアニメーションを更新
    if (Object.keys(this.objects.playerMap).length > 0) {
      Object.values(this.objects.playerMap).forEach(
        (player) => {
          if (!player.sync) return;
          //座標を更新
          player.sprite.x = player.sync.x;
          player.sprite.y = player.sync.y;

          //アニメーションを更新
          AnimationUtil.setPlayerAnimation(
            player.sprite,
            player.sync.animation,
            player.sync.direction
          );
        }
      );
    }

    if (Object.keys(this.objects.npcMap).length > 0) {
      Object.values(this.objects.npcMap).forEach((npc) => {
        if (!npc.sync) return;

        npc.sprite.x = npc.sync.x;
        npc.sprite.y = npc.sync.y;

        AnimationUtil.setNpcAnimation(
          npc.sprite,
          npc.sync.animation,
          npc.sync.direction
        );
      });
    }
  }
}
