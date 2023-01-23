import RoomManager from '../../../manager/roomManager';
import { GenericStage } from '../generic/genericStage';

export class PaintStage extends GenericStage {
  constructor(level: number, roomId: string, roomManager: RoomManager) {
    super(level, roomId, roomManager);
  }
}
