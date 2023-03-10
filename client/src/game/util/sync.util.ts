import { BombDto } from '../dto/bomb.dto';
import { ExplosionDto } from '../dto/explosion.dto';
import { ItemDto } from '../dto/item.dto';
import { NpcDto } from '../dto/npc.dto';
import { ObstacleDto } from '../dto/obstacle.dto';
import { PlayerDto } from '../dto/player.dto';
import { CustomScene } from '../scene/parent/customScene';
import { AnimationUtil } from './animation.util';

export class SyncUtil {
  static CHARACTER_WIDTH = 32;
  static CHARACTER_HEIGHT = 32;
  static setPlayer(playerArr: PlayerDto[], scene: CustomScene) {
    if (playerArr && playerArr.length > 0) {
      playerArr.forEach((player) => {
        //clientIdに対応するデータがない場合、新たにspriteを作成する
        if (!scene.objects.playerMap[player.clientId]) {
          let sprite = scene.add
            .sprite(player.x, player.y, player.spriteKey)
            .setOrigin(0.5)
            .setScale(1.0);

          const lifeGauge = SyncUtil.createLifeGauge(player, scene);

          const nameText = SyncUtil.createNameText(player, scene);

          const appear = scene.add
            .sprite(player.x, player.y, '')
            .setOrigin(0.5, 0.7)
            .setScale(1.0)
            .play('appear-anim');
          setTimeout(() => {
            appear.destroy();
          }, 1500);

          scene.objects.playerMap[player.clientId] = {
            sprite: sprite,
            nameText: nameText,
            leftGauge: lifeGauge.leftGauge,
            rightGauge: lifeGauge.rightGauge,
            sync: null,
          };
        }
        //updateメソッドで使用するためのデータをsyncに格納する
        scene.objects.playerMap[player.clientId]['sync'] = player;
      });
    }
  }

  static createNameText(player: PlayerDto, scene: CustomScene) {
    return scene.add
      .text(
        player.x,
        player.y - SyncUtil.CHARACTER_HEIGHT * 1.5 + 10,
        player.userName
      )
      .setTint(0x333333)
      .setOrigin(0.5);
  }

  //ライフゲージを作るメソッド
  static createLifeGauge(character: PlayerDto | NpcDto, scene: CustomScene) {
    const cellWidth = SyncUtil.CHARACTER_WIDTH / character.initLife;
    const sx = character.x - cellWidth * character.initLife * 0.5;
    const sy = character.y - SyncUtil.CHARACTER_HEIGHT;

    let color = 0x00ff00;
    if (character.life <= character.initLife / 3) {
      color = 0xff0000;
    }
    const leftGauge = scene.add
      .graphics()
      .fillStyle(color)
      .fillRect(sx, sy, cellWidth * character.life, 10);
    const rightGauge = scene.add
      .graphics()
      .fillStyle(0x998877)
      .fillRect(
        sx + cellWidth * character.life,
        sy,
        cellWidth * (character.initLife - character.life),
        10
      );
    return { leftGauge, rightGauge };
  }

  static setNpc(npcArr: NpcDto[], scene: CustomScene) {
    if (npcArr && npcArr.length > 0) {
      npcArr.forEach((npc) => {
        if (!scene.objects.npcMap[npc.id]) {
          let sprite = scene.add
            .sprite(npc.x, npc.y, npc.spriteKey)
            .setOrigin(0.5)
            .setScale(1.0);

          const lifeGauge = SyncUtil.createLifeGauge(npc, scene);

          scene.objects.npcMap[npc.id] = {
            sprite: sprite,
            leftGauge: lifeGauge.leftGauge,
            rightGauge: lifeGauge.rightGauge,
            sync: null,
          };
        }
        scene.objects.npcMap[npc.id]['sync'] = npc;
      });
    }
  }

  static setObstacle(obstacleArr: ObstacleDto[], scene: CustomScene) {
    if (obstacleArr && obstacleArr.length > 0) {
      obstacleArr.map((obstacle) => {
        if (!scene.objects.obstacleMap[obstacle.id]) {
          let sprite = scene.add
            .sprite(obstacle.x, obstacle.y, obstacle.spriteKey)
            .setOrigin(0.5)
            .setScale(1.0);
          scene.objects.obstacleMap[obstacle.id] = {
            sprite: sprite,
            sync: null,
          };
        }
        scene.objects.obstacleMap[obstacle.id]['sync'] = obstacle;
      });
    }
  }

  static setItem(itemArr: ItemDto[], scene: CustomScene) {
    if (itemArr && itemArr.length > 0) {
      itemArr.map((item) => {
        if (!scene.objects.itemMap[item.id]) {
          let sprite = scene.add
            .sprite(item.x, item.y, item.spriteKey)
            .setOrigin(0.5)
            .setScale(0.23);
          scene.objects.itemMap[item.id] = {
            sprite: sprite,
            sync: null,
          };
        }
        scene.objects.itemMap[item.id]['sync'] = item;
      });
    }
  }

  static setBomb(bombArr: BombDto[], scene: CustomScene) {
    // console.log('爆弾の配列', bombArr);
    if (bombArr && bombArr.length > 0) {
      bombArr.map((bomb) => {
        if (!scene.objects.bombMap[bomb.id]) {
          let sprite = scene.add
            .sprite(bomb.x, bomb.y, bomb.spriteKey)
            .setOrigin(0.5)
            .setScale(1.0);
          scene.objects.bombMap[bomb.id] = {
            sprite: sprite,
            sync: null,
          };
        }
        scene.objects.bombMap[bomb.id]['sync'] = bomb;
      });
    }
  }

  static setExplosion(explosionArr: ExplosionDto[], scene: CustomScene) {
    if (explosionArr && explosionArr.length > 0) {
      explosionArr.map((explosion) => {
        if (!scene.objects.explosionMap[explosion.id]) {
          let sprite = scene.add
            .sprite(explosion.x, explosion.y, explosion.spriteKey)
            .setOrigin(0.5)
            .setScale(1.0);
          // .play(explosion.animation);
          scene.objects.explosionMap[explosion.id] = {
            sprite: sprite,
            sync: null,
          };
        }
        scene.objects.explosionMap[explosion.id]['sync'] = explosion;
      });
    }
  }

  static destroyPlayer(clientId: string, scene: CustomScene) {
    let player = scene.objects.playerMap[clientId];
    if (!player) return;
    player.sprite.destroy();
    player.nameText.destroy();
    player.leftGauge.destroy();
    player.rightGauge.destroy();
    player.sync = null;

    delete scene.objects.playerMap[clientId];
  }

  static destroyNpc(id: number, scene: CustomScene) {
    let npc = scene.objects.npcMap[id];
    if (!npc) return;
    npc.sprite.destroy();
    npc.leftGauge.destroy();
    npc.rightGauge.destroy();
    npc.sync = null;

    delete scene.objects.npcMap[id];
  }

  static destroyBomb(id: number, scene: CustomScene) {
    let bomb = scene.objects.bombMap[id];
    if (!bomb) return;
    bomb.sprite.destroy();
    bomb.sync = null;

    delete scene.objects.bombMap[id];
  }

  static destroyExplosion(id: number, scene: CustomScene) {
    let explosion = scene.objects.explosionMap[id];
    if (!explosion) return;
    explosion.sprite.destroy();
    explosion.sync = null;

    delete scene.objects.explosionMap[id];
  }

  static destroyObstacle(id: number, scene: CustomScene) {
    let obstacle = scene.objects.obstacleMap[id];
    if (!obstacle) return;
    obstacle.sprite.destroy();
    obstacle.sync = null;

    delete scene.objects.obstacleMap[id];
  }

  static destroyItem(id: number, scene: CustomScene) {
    let item = scene.objects.itemMap[id];
    if (!item) return;
    item.sprite.destroy();

    if (item.sync) {
      let effectKey = '';
      switch (item.sync.spriteKey) {
        case 'yellowBean':
          effectKey = 'yellowEffect';
          break;
        case 'orangeBean':
          effectKey = 'orangeEffect';
          break;
        case 'blueBean':
          effectKey = 'blueEffect';
          break;
      }
      let effect = scene.add
        .sprite(item.sync.x, item.sync.y, '')
        .setOrigin(0.5)
        .setScale(1.0)
        .play(`${effectKey}-anim`);
      setTimeout(() => {
        effect.destroy();
      }, 600);
    }

    item.sync = null;

    delete scene.objects.itemMap[id];
  }

  static updateObstacle(id: number, spriteKey: string, scene: CustomScene) {
    let obstacle = scene.objects.obstacleMap[id];
    if (!obstacle) return;
    obstacle.sprite.setTexture(spriteKey);
  }

  static updateBomb(scene: CustomScene) {
    if (Object.keys(scene.objects.bombMap).length > 0) {
      Object.values(scene.objects.bombMap).forEach((bomb) => {
        if (!bomb.sync) return;
        AnimationUtil.setBombAnimation(bomb.sprite, bomb.sync.animation);
      });
    }
  }

  static updateExplosion(scene: CustomScene) {
    if (Object.keys(scene.objects.explosionMap).length > 0) {
      Object.values(scene.objects.explosionMap).forEach((explosion) => {
        if (!explosion.sync) return;
        AnimationUtil.setExplosionAnimation(
          explosion.sprite,
          explosion.sync.animation
        );
      });
    }
  }

  static updatePlayer(scene: CustomScene) {
    //syncのデータを基に、spriteの座標とアニメーションを更新
    if (Object.keys(scene.objects.playerMap).length > 0) {
      Object.values(scene.objects.playerMap).forEach((player) => {
        if (!player.sync || !player.sprite) return;
        //座標を更新
        player.sprite.x = player.sync.x;
        player.sprite.y = player.sync.y;

        player.nameText.destroy();

        player.leftGauge.destroy();
        player.rightGauge.destroy();

        const nameText = SyncUtil.createNameText(player.sync, scene);

        player.nameText = nameText;

        const lifeGauge = SyncUtil.createLifeGauge(player.sync, scene);

        player.leftGauge = lifeGauge.leftGauge;
        player.rightGauge = lifeGauge.rightGauge;

        //アニメーションを更新
        AnimationUtil.setPlayerAnimation(
          player.sprite,
          player.sync.animation,
          player.sync.direction
        );
      });
    }
  }

  static updateNpc(scene: CustomScene) {
    if (Object.keys(scene.objects.npcMap).length > 0) {
      Object.values(scene.objects.npcMap).forEach((npc) => {
        if (!npc.sync) return;

        npc.sprite.x = npc.sync.x;
        npc.sprite.y = npc.sync.y;

        npc.leftGauge.destroy();
        npc.rightGauge.destroy();

        const lifeGauge = SyncUtil.createLifeGauge(npc.sync, scene);

        npc.leftGauge = lifeGauge.leftGauge;
        npc.rightGauge = lifeGauge.rightGauge;

        AnimationUtil.setNpcAnimation(
          npc.sprite,
          npc.sync.animation,
          npc.sync.direction
        );
      });
    }
  }
}
