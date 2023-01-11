import RoomManager from '../manager/roomManager';
import { CommonConfig } from './commonConfig';
import { ServerConfig } from './serverConfig';
import { Stage } from './stage/stage';
import { OverlapTester } from './util/overlapTester';

export class Game {
  time: number = Date.now();
  roomId: string;
  roomManager: RoomManager;
  stage: Stage;

  constructor(roomId: string, roomManager: RoomManager) {
    this.roomId = roomId;
    this.roomManager = roomManager;
    this.stage = new Stage(1, roomId, roomManager);

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
      const hrtime = process.hrtime(); // ナノ秒単位で取得

      // ゲームワールドの更新
      this.stage.update(deltaTime);

      const hrtimeDiff = process.hrtime(hrtime);
      const nanoSecDiff =
        hrtimeDiff[0] * 1e9 + hrtimeDiff[1];

      // 最新状況をクライアントに個別に送信
      // タンクごとの処理
      // this.stage.tankSet.forEach((tank) => {
      //   if ('' !== tank.clientId) {
      //     // ボットは無処理
      //     const rectVisibleArea = {
      //       fLeft: tank.x - CommonConfig.CANVAS_WIDTH * 0.5,
      //       fBottom:
      //         tank.y - CommonConfig.CANVAS_HEIGHT * 0.5,
      //       fRight:
      //         tank.x + CommonConfig.CANVAS_WIDTH * 0.5,
      //       fTop: tank.y + CommonConfig.CANVAS_HEIGHT * 0.5,
      //     };
      //     this.roomManager.ioNspGame
      //       .to(tank.clientId)
      //       .emit('syncGame', {
      //         nanoSecDiff,
      //         tankArr: Array.from(
      //           this.stage.tankSet
      //         ).filter((tank) => {
      //           return OverlapTester.overlapRects(
      //             rectVisibleArea,
      //             tank.rectBound
      //           );
      //         }),
      //         wallArr: Array.from(
      //           this.stage.wallSet
      //         ).filter((wall) => {
      //           return OverlapTester.overlapRects(
      //             rectVisibleArea,
      //             wall.rectBound
      //           );
      //         }),
      //         bulletArr: Array.from(
      //           this.stage.bulletSet
      //         ).filter((bullet) => {
      //           return OverlapTester.overlapRects(
      //             rectVisibleArea,
      //             bullet.rectBound
      //           );
      //         }),
      //         botArr: Array.from(this.stage.botSet).filter(
      //           (bot) => {
      //             return OverlapTester.overlapRects(
      //               rectVisibleArea,
      //               bot.rectBound
      //             );
      //           }
      //         ),
      //       });
      //   }
      // });

      // // プレーしていないソケットごとの処理
      // const rectVisibleArea = {
      //   fLeft:
      //     CommonConfig.FIELD_WIDTH * 0.5 -
      //     CommonConfig.CANVAS_WIDTH * 0.5,
      //   fBottom:
      //     CommonConfig.FIELD_HEIGHT * 0.5 -
      //     CommonConfig.CANVAS_HEIGHT * 0.5,
      //   fRight:
      //     CommonConfig.FIELD_WIDTH * 0.5 +
      //     CommonConfig.CANVAS_WIDTH * 0.5,
      //   fTop:
      //     CommonConfig.FIELD_HEIGHT * 0.5 +
      //     CommonConfig.CANVAS_HEIGHT * 0.5,
      // };
      // this.stage.setNotPlayingSocketID.forEach(
      //   (clientId) => {
      //     this.roomManager.ioNspGame
      //       .to(clientId)
      //       .emit('syncGame', {
      //         nanoSecDiff,

      //         tankArr: Array.from(
      //           this.stage.tankSet
      //         ).filter((tank) => {
      //           return OverlapTester.overlapRects(
      //             rectVisibleArea,
      //             tank.rectBound
      //           );
      //         }),
      //         wallArr: Array.from(
      //           this.stage.wallSet
      //         ).filter((wall) => {
      //           return OverlapTester.overlapRects(
      //             rectVisibleArea,
      //             wall.rectBound
      //           );
      //         }),
      //         bulletArr: Array.from(
      //           this.stage.bulletSet
      //         ).filter((bullet) => {
      //           return OverlapTester.overlapRects(
      //             rectVisibleArea,
      //             bullet.rectBound
      //           );
      //         }),
      //         botArr: Array.from(this.stage.botSet).filter(
      //           (bot) => {
      //             return OverlapTester.overlapRects(
      //               rectVisibleArea,
      //               bot.rectBound
      //             );
      //           }
      //         ),
      //       });
      //     // 個別送信
      //   }
      // );

      // //ルーム内のユーザーにデータを送信
      this.roomManager.ioNspGame
        .in(this.roomId)
        .emit('syncGame', {
          nanoSecDiff,
          tankArr: Array.from(this.stage.tankSet),
          wallArr: Array.from(this.stage.wallSet),
          bulletArr: Array.from(this.stage.bulletSet),
          botArr: Array.from(this.stage.botSet),
        });
    }, 1000 / ServerConfig.FRAMERATE); // 単位は[ms]。1000[ms] / FRAMERATE[回]
  }
}
