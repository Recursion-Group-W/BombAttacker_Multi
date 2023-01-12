import { Game } from '../game/game';
import { Stage } from '../game/stage/stage';
import RoomManager from './roomManager';

//ステージ移動に必要？
export class GameManager {
  game: Game;

  // stageManager: StageManager
  constructor(roomId: string, roomManager: RoomManager) {
    this.game = new Game(
      roomId,
      roomManager,
      new Stage(1, roomId, roomManager)
    );
  }

  // switchStage(stage: Stage, playerSet: any){
  //     this.game.stage = stage
  //     this.game.stage.playerSet = playerSet
  // }
}
