import RoomManager from '../../manager/roomManager';
import { MathUtil } from '../util/math.util';
import { Stage } from './stage';

export class FirstStage extends Stage {
  readonly STAGE_WIDTH = 1160;
  readonly STAGE_HEIGHT = 1160;
  readonly NPC_COUNT = 10;
  constructor(level: number, roomId: string, roomManager: RoomManager) {
    super(level, roomId, roomManager);
  }
}
