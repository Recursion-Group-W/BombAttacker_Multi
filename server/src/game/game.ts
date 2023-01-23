import RoomManager from '../manager/roomManager';
import { ServerConfig } from './config/serverConfig';
import { FirstPaintStage } from './stage/paint/firstPaintStage';

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

      // ゲームステージの更新
      this.stage.update(deltaTime);

      // const hrtimeDiff = process.hrtime(hrtime);
      // const nanoSecDiff =
      //   hrtimeDiff[0] * 1e9 + hrtimeDiff[1];

      // //ルーム内のユーザーにデータを送信
      this.roomManager.ioNspGame.in(this.roomId).emit('syncGame', {
        time: deltaTime,
        playerArr: this.stage.playerList.toArray(),
        npcArr: this.stage.npcList.toArray(),
        bombArr: this.stage.bombList.toArray(),
        explosionArr: this.stage.explosionList.toArray(),
      });
    }, 1000 / ServerConfig.FRAMERATE); // 単位は[ms]。1000[ms] / FRAMERATE[回]
  }

  getInitialState() {
    return {
      playerArr: this.stage.playerList.toArray(),
      npcArr: this.stage.npcList.toArray(),
      obstacleArr: this.stage.obstacleList.toArray(),
    };
  }
}
