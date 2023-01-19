import { RectBound } from '../types/rectBound.type';
import { CommonConfig } from '../config/commonConfig';
import { Node } from '../../linkedList/generic/node';
import { GenericObstacle } from '../model/obstacle/generic/genericObstacle';
import { Player } from '../model/player/player';
import { OverlapUtil} from './overlap.util';

export class ObjectUtil {
  static calRectField(width: number, height: number): RectBound {
    return {
      left: 0 + width * 0.5,
      bottom: 0 + height * 0.5,
      right: CommonConfig.STAGE_WIDTH - width * 0.5,
      top: CommonConfig.STAGE_HEIGHT - height * 0.5,
    };
  }

  //プレイヤー移動の補正値を計算するして更新するメソッド
  static calCorrection(
    obstacleNode: Node<GenericObstacle>,
    player: Player,
    correction: { x: number; y: number }
  ) {
    const obstacle = obstacleNode.data;
    if (
      player.getPosition.x >= obstacle.getPosition.x &&
      player.getPosition.y <= obstacle.getPosition.y
    ) {
      const diffX = player.getPosition.x - obstacle.getPosition.x;
      const diffY = obstacle.getPosition.y - player.getPosition.y;
      if (diffX >= diffY) {
        if (diffY >= ((obstacle.getHeight + player.getHeight) / 2) * (2 / 5)) {
          //隣の障害物
          let nextObstacle = obstacleNode.prev?.data;
          if (nextObstacle) {
            if (
              !OverlapUtil.overlapRects(
                nextObstacle.rectBound,
                player.rectBound
              )
            ) {
              correction.y =
                -1 *
                (obstacle.getHeight / 2 +
                  player.getHeight / 2 -
                  (obstacle.getPosition.y - player.getPosition.y));
            }
          }
        }
      } else {
      }
    }
  }
}
