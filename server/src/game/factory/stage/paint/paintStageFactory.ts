import RoomManager from '../../../../manager/roomManager';
import { FirstPaintStage } from '../../../stage/firstPaintStage';
import { BrickFactory } from '../../obstacle/brick/brickFactory';

export class PaintStageFactory {
  obstacleFactory = new BrickFactory()
  createFirstStage(
    roomId: string,
    roomManager: RoomManager
  ) {
    return new FirstPaintStage(1, roomId, roomManager);
  }
}
