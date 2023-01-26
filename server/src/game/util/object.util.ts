import { RectBound } from '../types/rectBound.type';
import { CommonConfig } from '../config/commonConfig';
import { Node } from '../../linkedList/generic/node';
import { GenericObstacle } from '../model/obstacle/generic/genericObstacle';
import { Player } from '../model/player/player';
import { OverlapUtil } from './overlap.util';

export class ObjectUtil {
  static calRectField(
    width: number,
    height: number,
    stageWidth: number,
    stageHeight: number
  ): RectBound {
    return {
      left: 0 + width * 0.5,
      bottom: 0 + height * 0.5,
      right: stageWidth - width * 0.5,
      top: stageHeight - height * 0.5,
    };
  }

  //プレイヤー移動の補正値を計算するして更新するメソッド
  static calCorrection(
    squareCache: Array<Array<GenericObstacle | null>>,
    obstacleNode: Node<GenericObstacle>,
    player: Player,
    correction: { x: number; y: number }
  ) {
    //ぶつかった障害物
    const obstacle = obstacleNode.data;
    // console.log('obstacle: ', obstacle);

    const scale = 4 / 8;
    //補正を行うかどうかの判定で使用する(ずれが2/5であれば補正する)
    const requireX = ((obstacle.getWidth + player.getWidth) / 2) * scale;
    const requireY = ((obstacle.getHeight + player.getHeight) / 2) * scale;
    //マスのキャッシュ(squareCache)から、ぶつかった障害物をO(1)で探すためのインデックス
    const iX = Math.floor(obstacle.getPosition.x / obstacle.getWidth);
    const iY = Math.floor(obstacle.getPosition.y / obstacle.getHeight);
    // const iX = Math.floor(obstacle.id / squareCache.length);
    // const iY = obstacle.id % squareCache[iX].length;

    //障害物とプレイヤーの座標の差
    let diffX = player.getPosition.x - obstacle.getPosition.x;
    let diffY = player.getPosition.y - obstacle.getPosition.y;

    //プレイヤーが、ぶつかった障害物の右側にいる場合
    if (diffX >= 0) {
      //プレイヤーが、ぶつかった障害物の右上にいる場合
      if (diffY <= 0) {
        diffY *= -1;
        if (diffX <= diffY) {
          if (diffX >= requireX) {
            let nextObstacle = squareCache[iX + 1][iY];
            // console.log('ix: ', iX, ', iY : ', iY);
            // console.log('ix+1: ', iX + 1, ', iY : ', iY);
            // console.log('next', nextObstacle);
            if (nextObstacle == null) {
              correction.x = (obstacle.getWidth + player.getWidth) / 2 - diffX;
            }
          }
        } else {
          if (diffY >= requireY) {
            //隣の障害物
            let nextObstacle = squareCache[iX][iY - 1];
            if (nextObstacle == null) {
              correction.y =
                -1 * (obstacle.getHeight / 2 + player.getHeight / 2 - diffY);
            }
          }
        }
      }
      //プレイヤーが、ぶつかった障害物の右下にいる場合
      else {
        if (diffX >= diffY) {
          if (diffY >= requireY) {
            let nextObstacle = squareCache[iX][iY + 1];
            if (nextObstacle == null) {
              correction.y =
                obstacle.getHeight / 2 + player.getHeight / 2 - diffY;
            }
          }
        } else {
          if (diffX >= requireX) {
            let nextObstacle = squareCache[iX + 1][iY];
            if (nextObstacle == null) {
              correction.x = (obstacle.getWidth + player.getWidth) / 2 - diffX;
            }
          }
        }
      }
    }
    //プレイヤーが、ぶつかった障害物の左側にいる場合
    else {
      diffX *= -1;
      //プレイヤーが、ぶつかった障害物の左下にいる場合
      if (diffY >= 0) {
        if (diffX <= diffY) {
          if (diffX >= requireX) {
            let nextObstacle = squareCache[iX - 1][iY];
            if (nextObstacle == null) {
              correction.x =
                -1 * ((obstacle.getWidth + player.getWidth) / 2 - diffX);
            }
          }
        } else {
          if (diffY >= requireY) {
            let nextObstacle = squareCache[iX][iY + 1];
            if (nextObstacle == null) {
              correction.y =
                obstacle.getHeight / 2 + player.getHeight / 2 - diffY;
            }
          }
        }
      }
      //プレイヤーが、ぶつかった障害物の左上にいる場合
      else {
        diffY *= -1;
        if (diffX >= diffY) {
          if (diffY >= requireY) {
            let nextObstacle = squareCache[iX][iY - 1];
            if (nextObstacle == null) {
              correction.y =
                -1 * (obstacle.getHeight / 2 + player.getHeight / 2 - diffY);
            }
          }
        } else {
          if (diffX >= requireX) {
            let nextObstacle = squareCache[iX - 1][iY];
            if (nextObstacle == null) {
              correction.x =
                -1 * ((obstacle.getWidth + player.getWidth) / 2 - diffX);
            }
          }
        }
      }
    }
  }
}
