import { Scene } from 'phaser';
import { CustomSocket } from '../../../socket/interface/customSocket.interface';
import { Objects } from '../../types/objects.type';

export class CustomScene extends Scene {
  public socket: CustomSocket | null = null;

  objects: Objects = {
    playerMap: {},
    npcMap: {},
    obstacleMap: {},
    bombMap: {},
  };
}
