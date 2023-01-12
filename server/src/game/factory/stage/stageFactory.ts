import RoomManager from '../../../manager/roomManager';
import { Stage } from '../../stage/stage';

export class StageFactory {
  createFirstStage(
    roomId: string,
    roomManager: RoomManager
  ) {
    return new Stage(1, roomId, roomManager);
  }
}
