import { StageFactory } from '../game/factory/stage/stageFactory';

//ステージを拡張する場合に使う
export class StageManager {
  normalStageFactory() {
    return new StageFactory();
  }
}
