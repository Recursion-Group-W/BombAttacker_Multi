import { FourthObstacle } from '../../../model/obstacle/generic/genericFourthObstacle';
import { FirstObstacle } from '../../../model/obstacle/interface/firstObstacle.interface';
import { SecondObstacle } from '../../../model/obstacle/interface/secondObstacle.interface';
import { ThirdObstacle } from '../../../model/obstacle/interface/thirdObstacle.interface';

//障害物の拡張に対応できるようにinterfaceを実装
export interface ObstacleFactory {
  createFirstObstacle(
    id: number,
    x: number,
    y: number
  ): FirstObstacle;

  createSecondObstacle(
    id: number,
    x: number,
    y: number
  ): SecondObstacle;

  createThirdObstacle(
    id: number,
    x: number,
    y: number
  ): ThirdObstacle;

  createFourthObstacle(
    id: number,
    x: number,
    y: number
  ): FourthObstacle;
}
