import { Scene } from 'phaser';
import { AnimationUtil } from '../util/animationUtil';

export class MainScene extends Scene {
  public socket: any;

  objects: { [key: string]: { [id: string]: any } } = {
    playerMap: {},
    npcMap: {},
    obstacleMap: {},
  };

  constructor() {
    super({ key: 'MainScene' });
    // playerRight
    // this.socket.on('', function
    // (movementDate) {
    // Player.anims.play('player-right', true);
    // });
  }

  create() {
    // this.initAnimation();
    this.socket = this.registry.get('socket');
    console.log('socket: ', this.socket);
    // this.socket.on('', function
    // (movementDate) {
    // Player.anims.play('player-right', true);
    // });
    this.socket.on(
      'syncGame',
      (res: {
        nanoSecDiff: number;
        playerArr: any[];
        npcArr: any[];
        obstacleArr: any[];
        tankArr: any[];
        tankObstacleArr: any[];
        bulletArr: any[];
        botArr: any[];
      }) => {
        if (res.playerArr.length > 0) {
          res.playerArr.forEach((player) => {
            if (!this.objects.playerMap[player.clientId]) {
              let sprite = this.add
                .sprite(
                  player.x,
                  player.y,
                  player.spriteKey
                )
                .setOrigin(0.5);
              this.objects.playerMap[player.clientId] = {
                sprite: sprite,
              };
            }
            this.objects.playerMap[player.clientId][
              'sync'
            ] = player;
          });
        }

        if (res.npcArr.length > 0) {
          res.npcArr.forEach((npc) => {
            if (!this.objects.npcMap[npc.id]) {
              let sprite = this.add
                .sprite(npc.x, npc.y, npc.spriteKey)
                .setOrigin(0.5);
              this.objects.npcMap[npc.id] = {
                sprite: sprite,
              };
            }
            this.objects.npcMap[npc.id]['sync'] = npc;
          });
        }
        if (res.obstacleArr.length > 0) {
          res.obstacleArr.map((obstacle) => {
            if (!this.objects.obstacleMap[obstacle.id]) {
              let sprite = this.add
                .sprite(
                  obstacle.x,
                  obstacle.y,
                  obstacle.spriteKey
                )
                .setOrigin(0.5);
              this.objects.obstacleMap[obstacle.id] = {
                sprite: sprite,
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
    if (Object.keys(this.objects.playerMap).length > 0) {
      Object.values(this.objects.playerMap).forEach(
        (player) => {
          player.sprite.x = player.sync.x;
          player.sprite.y = player.sync.y;

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
