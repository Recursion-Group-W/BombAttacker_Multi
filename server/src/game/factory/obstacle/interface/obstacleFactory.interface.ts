import { GenericFirstObstacle } from '../../../model/obstacle/generic/genericFirstObstacle';
import { FourthObstacle } from '../../../model/obstacle/generic/genericFourthObstacle';
import { GenericSecondObstacle } from '../../../model/obstacle/generic/genericSecondObstacle';
import { GenericThirdObstacle } from '../../../model/obstacle/generic/genericThirdObstacle';
import { FirstObstacle } from '../../../model/obstacle/interface/firstObstacle.interface';
import { SecondObstacle } from '../../../model/obstacle/interface/secondObstacle.interface';
import { ThirdObstacle } from '../../../model/obstacle/interface/thirdObstacle.interface';

//障害物の拡張に対応できるようにinterfaceを実装
export interface ObstacleFactory {
  createFirstObstacle(
    id: number,
    x: number,
    y: number
  ): GenericFirstObstacle;

  createSecondObstacle(
    id: number,
    x: number,
    y: number
  ): GenericSecondObstacle;

  createThirdObstacle(
    id: number,
    x: number,
    y: number
  ): GenericThirdObstacle;

  createFourthObstacle(
    id: number,
    x: number,
    y: number
  ): GenericFirstObstacle;
}
