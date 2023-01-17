import { NpcDto } from '../dto/npc.dto';
import { ObstacleDto } from '../dto/obstacle.dto';
import { PlayerDto } from '../dto/player.dto';
import { CustomScene } from '../scene/parent/customScene';
import { AnimationUtil } from './animation.util';

export class SyncUtil {
  static setPlayer(
    playerArr: PlayerDto[],
    scene: CustomScene
  ) {
    if (playerArr && playerArr.length > 0) {
      playerArr.forEach((player) => {
        //clientIdに対応するデータがない場合、新たにspriteを作成する
        if (!scene.objects.playerMap[player.clientId]) {
          let sprite = scene.add
            .sprite(player.x, player.y, player.spriteKey)
            .setOrigin(0.5)
            .setScale(1.2);
          scene.objects.playerMap[player.clientId] = {
            sprite: sprite,
            sync: null,
          };
        }
        //updateメソッドで使用するためのデータをsyncに格納する
        scene.objects.playerMap[player.clientId]['sync'] =
          player;
      });
    }
  }

  static setNpc(npcArr: NpcDto[], scene: CustomScene) {
    if (npcArr && npcArr.length > 0) {
      npcArr.forEach((npc) => {
        if (!scene.objects.npcMap[npc.id]) {
          let sprite = scene.add
            .sprite(npc.x, npc.y, npc.spriteKey)
            .setOrigin(0.5)
            .setScale(1.2);
          scene.objects.npcMap[npc.id] = {
            sprite: sprite,
            sync: null,
          };
        }
        scene.objects.npcMap[npc.id]['sync'] = npc;
      });
    }
  }

  static setObstacle(
    obstacleArr: ObstacleDto[],
    scene: CustomScene
  ) {
    if (obstacleArr && obstacleArr.length > 0) {
      obstacleArr.map((obstacle) => {
        if (!scene.objects.obstacleMap[obstacle.id]) {
          let sprite = scene.add
            .sprite(
              obstacle.x,
              obstacle.y,
              obstacle.spriteKey
            )
            .setOrigin(0.5)
            .setScale(1.25);
          scene.objects.obstacleMap[obstacle.id] = {
            sprite: sprite,
            sync: null,
          };
        }
        scene.objects.obstacleMap[obstacle.id]['sync'] =
          obstacle;
      });
    }
  }

  static updatePlayer(scene: CustomScene) {
    //syncのデータを基に、spriteの座標とアニメーションを更新
    if (Object.keys(scene.objects.playerMap).length > 0) {
      Object.values(scene.objects.playerMap).forEach(
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
  }

  static updateNpc(scene: CustomScene) {
    if (Object.keys(scene.objects.npcMap).length > 0) {
      Object.values(scene.objects.npcMap).forEach((npc) => {
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