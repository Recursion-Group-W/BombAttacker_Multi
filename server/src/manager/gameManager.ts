import { Game } from '../game/game';
import { FirstPaintStage } from '../game/stage/firstPaintStage';
import RoomManager from './roomManager';
import { StageManager } from './stageManager';

//ステージ移動に必要？
export class GameManager {
  game: Game;
  stageManager = new StageManager();

  constructor(roomId: string, roomManager: RoomManager) {
    this.game = new Game(
      roomId,
      roomManager,
      this.stageManager
        .paintStageFactory()
        .createFirstStage(roomId, roomManager)
    );
  }

  //interfaceを実装して、stage: Stageに変更が必要
  switchStage(stage: FirstPaintStage, playerSet: any) {
    this.game.stage = stage;
    this.game.stage.playerSet = playerSet;
  }
}
