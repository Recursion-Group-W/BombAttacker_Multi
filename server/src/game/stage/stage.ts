import RoomManager from '../../manager/roomManager';

export class Stage {
  // name = "normal"
  level: number;
  // background = ""
  // backgroundSet;
  // wallSet;
  // abstacleSet;
  // playerSet;
  // npcSet;
  // stageFactory;
  roomId: string;
  roomManager: RoomManager;

  constructor(
    level: number,
    roomId: string,
    roomManager: RoomManager
  ) {
    this.level = level;
    this.roomId = roomId;
    this.roomManager = roomManager;
  }

  // 更新処理
  update(deltaTime: number) {
    // オブジェクトの座標値の更新
    this.updateObjects(deltaTime);

    // 衝突チェック
    this.checkCollisions();

    // 新たな行動（特に、ボットに関する生成や動作
    this.doNewActions(deltaTime);
  }

  // オブジェクトの座標値の更新
  updateObjects(deltaTime: number) {}

  // 衝突のチェック
  checkCollisions() {}

  // 新たな行動
  doNewActions(deltaTime: number) {}

  // nextStage(){
  //     GameManager.switchStage(this.stageFactory.secondStage(),  this.playerSet)
  // }
}
