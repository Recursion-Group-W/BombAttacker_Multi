import { BombDto } from '../dto/bomb.dto';
import { ExplosionDto } from '../dto/explosion.dto';
import { NpcDto } from '../dto/npc.dto';
import { ObstacleDto } from '../dto/obstacle.dto';
import { PlayerDto } from '../dto/player.dto';

//Scene内で保持するオブジェクトのデータ型
//sprite: PhaserのSpriteオブジェクトを格納
//sync: クライアントから受け取ったデータを格納
export type Objects = {
  playerMap: {
    [clientId: string]: {
      sprite: Phaser.GameObjects.Sprite;
      sync: PlayerDto | null;
    };
  };
  npcMap: {
    [id: string]: {
      sprite: Phaser.GameObjects.Sprite;
      sync: NpcDto | null;
    };
  };
  obstacleMap: {
    [id: string]: {
      sprite: Phaser.GameObjects.Sprite;
      sync: ObstacleDto | null;
    };
  };
  bombMap: {
    [id: string]: {
      sprite: Phaser.GameObjects.Sprite;
      sync: BombDto | null;
    };
  };
  explosionMap: {
    [id: string]: {
      sprite: Phaser.GameObjects.Sprite;
      sync: ExplosionDto | null;
    };
  };
};
