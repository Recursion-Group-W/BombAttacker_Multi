import RoomManager from '../../manager/roomManager';
import { Stage } from './stage';

export class FirstStage extends Stage {
  readonly STAGE_WIDTH = 1024;
  readonly STAGE_HEIGHT = 1024;
  constructor(
    level: number,
    roomId: string,
    roomManager: RoomManager
  ) {
    super(level, roomId, roomManager);
  }
}
