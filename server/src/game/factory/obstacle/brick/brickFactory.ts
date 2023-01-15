import { FirstBrick } from '../../../model/obstacle/brick/firstBrick';
import { FourthBrick } from '../../../model/obstacle/brick/fourthBrick';
import { SecondBrick } from '../../../model/obstacle/brick/secondBrick';
import { ThirdBrick } from '../../../model/obstacle/brick/thirdBrick';
import { ObstacleFactory } from '../interface/obstacleFactory.interface';

//レンガを作る機能をStageクラスから切り離す
export class BrickFactory implements ObstacleFactory {
  static readonly BrickMap = {
    orange: {
      spriteKey: 'orangeBrick',
      endurance: 1,
    },
    green: {
      spriteKey: 'greenBrick',
      endurance: 2,
    },
    blue: {
      spriteKey: 'blueBrick',
      endurance: 3,
    },
    gray: {
      spriteKey: 'grayBrick',
      endurance: 4,
    },
  };
  createFirstObstacle(id: number, x: number, y: number) {
    return new FirstBrick(
      id,
      x,
      y,
      BrickFactory.BrickMap.orange.spriteKey,
      BrickFactory.BrickMap.orange.endurance
    );
  }
  createSecondObstacle(id: number, x: number, y: number) {
    return new SecondBrick(
      id,
      x,
      y,
      BrickFactory.BrickMap.green.spriteKey,
      BrickFactory.BrickMap.green.endurance
    );
  }
  createThirdObstacle(id: number, x: number, y: number) {
    return new ThirdBrick(
      id,
      x,
      y,
      BrickFactory.BrickMap.blue.spriteKey,
      BrickFactory.BrickMap.blue.endurance
    );
  }
  createFourthObstacle(id: number, x: number, y: number) {
    return new FourthBrick(
      id,
      x,
      y,
      BrickFactory.BrickMap.gray.spriteKey,
      BrickFactory.BrickMap.gray.endurance
    );
  }
}
