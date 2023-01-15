import { PaintStageFactory } from '../game/factory/stage/paint/paintStageFactory';

//ステージを拡張する場合に使う
export class StageManager {
  paintStageFactory() {
    return new PaintStageFactory();
  }
}
