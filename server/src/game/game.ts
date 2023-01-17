import RoomManager from '../manager/roomManager';
import { ServerConfig } from './config/serverConfig';
import { FirstPaintStage } from './stage/firstPaintStage';

export class Game {
  time: number = Date.now();
  roomId: string;
  roomManager: RoomManager;
  stage: FirstPaintStage; //interfaceを実装して、stage: Stageに変更が必要

  constructor(
    roomId: string,
    roomManager: RoomManager,
    stage: FirstPaintStage //interfaceを実装して、stage: Stageに変更が必要
  ) {
    this.roomId = roomId;
    this.roomManager = roomManager;
    this.stage = stage;
    // this.stage = new Stage(1, roomId, roomManager);

    this.update();
  }

  update() {
    // 周期的処理（1秒間にFRAMERATE回の場合、delayは、1000[ms]/FRAMERATE[回]）
    setInterval(() => {
      // 経過時間の算出
      const currTime = Date.now(); // ミリ秒単位で取得
      const deltaTime = (currTime - this.time) * 0.001; // 秒に変換
      this.time = currTime;
      //console.log( 'DeltaTime = %f[s]', fDeltaTime );

      // 処理時間計測用
      // const hrtime = process.hrtime(); // ナノ秒単位で取得

      // ゲームワールドの更新
      this.stage.update(deltaTime);

      // const hrtimeDiff = process.hrtime(hrtime);
      // const nanoSecDiff =
      //   hrtimeDiff[0] * 1e9 + hrtimeDiff[1];

      // //ルーム内のユーザーにデータを送信
      this.roomManager.ioNspGame.in(this.roomId).emit('syncGame', {
        // nanoSecDiff,
        time: this.time,
        playerArr: Array.from(this.stage.playerSet),
        npcArr:this.stage.npcList.toArray(),
        // npcArr: Array.from(this.stage.npcSet),
        // obstacleArr: Array.from(this.stage.obstacleSet),
        // tankArr: Array.from(this.stage.tankSet),
        // tankObstacleArr: Array.from(
        //   this.stage.tankobstacleSet
        // ),
        // bulletArr: Array.from(this.stage.bulletSet),
        // botArr: Array.from(this.stage.botSet),
      });
    }, 1000 / ServerConfig.FRAMERATE); // 単位は[ms]。1000[ms] / FRAMERATE[回]
  }

  getInitialState() {
    console.log(this.stage.obstacleList.toArray());
    return {
      playerArr: Array.from(this.stage.playerSet),
      
      // npcArr: Array.from(this.stage.npcSet),
      npcArr:this.stage.npcList.toArray(),
      // obstacleArr: Array.from(this.stage.obstacleSet),
      obstacleArr: this.stage.obstacleList.toArray(),
    };
  }

  // // //ルーム内のユーザーにデータを送信
  // this.roomManager.ioNspGame
  // .in(this.roomId)
  // .emit('syncGame', {
  //   nanoSecDiff,
  //   playerArr: Array.from(this.stage.playerSet),
  //   obstacleArr: Array.from(this.stage.obstacleSet),
  //   tankArr: Array.from(this.stage.tankSet),
  //   tankObstacleArr: Array.from(
  //     this.stage.tankobstacleSet
  //   ),
  //   bulletArr: Array.from(this.stage.bulletSet),
  //   botArr: Array.from(this.stage.botSet),
  // });
}
