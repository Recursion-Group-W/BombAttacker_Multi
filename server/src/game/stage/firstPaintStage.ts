import RoomManager from '../../manager/roomManager';
import { BotTank } from '../model/tank/botTank';
import { Bullet } from '../model/tank/bullet';
import { Tank } from '../model/tank/tank';
import { TankObstacle } from '../model/tank/tankObstacle';
import { ServerConfig } from '../config/serverConfig';
import { OverlapTester } from '../util/overlapTester';
import { Player } from '../model/player/player';
import { GenericObstacle } from '../model/obstacle/generic/genericObstacle';
import { Movement } from '../types/movement.type';
import { FirstStage } from './firstStage';
import { BrickFactory } from '../factory/obstacle/brick/brickFactory';
import { MathUtil } from '../util/math.util';
import { Npc } from '../model/npc/npc';
import { Bomb } from '../model/bomb';

export class FirstPaintStage extends FirstStage {
  // type='paint'
  // background = ""
  obstacleFactory = new BrickFactory();

  constructor(
    level: number,
    roomId: string,
    roomManager: RoomManager
  ) {
    super(level, roomId, roomManager);

    //障害物の生成
    this.createObstacles();

    //npc作成
    //後でfactoryを作成して、npc作成の機能をステージから切り離したい
    for (let i = 0; i < 10; i++) {
      this.createNpc();
    }

    // ボットの生成
    // for (let i = 0; i < ServerConfig.BOTTANK_COUNT; i++) {
    //   this.createBotTank('Bot' + (i + 1));
    // }
  }

  //障害物の生成
  createObstacles() {
    //ステージ余白を均等にするために、余白extraを算出
    const extra = Math.floor(
      (this.STAGE_WIDTH %
        (this.TILE_SIZE * this.TILE_SPAN_SCALE)) /
        2
    );

    //耐久力の高い障害物を均等に配置
    for (
      let i = 1;
      i <
      Math.floor(
        this.STAGE_WIDTH /
          this.TILE_SIZE /
          this.TILE_SPAN_SCALE
      ) -
        1;
      i = i + 2
    ) {
      for (
        let j = 1;
        j <
        Math.floor(
          this.STAGE_HEIGHT /
            this.TILE_SIZE /
            this.TILE_SPAN_SCALE
        ) -
          1;
        j = j + 2
      ) {
        const x =
          i * this.TILE_SIZE * this.TILE_SPAN_SCALE +
          this.TILE_SIZE * 0.5 +
          extra;
        const y =
          j * this.TILE_SIZE * this.TILE_SPAN_SCALE +
          this.TILE_SIZE * 0.5 +
          extra;

        //後で双方向リストに書き換えて計算量減らしたい
        const obstacleArr = Array.from(this.obstacleSet);
        const id =
          obstacleArr.length <= 0
            ? 0
            : obstacleArr[obstacleArr.length - 1].id + 1;

        const obstacle =
          this.obstacleFactory.createFourthObstacle(
            id,
            x,
            y
          );
        this.obstacleSet.add(obstacle);
      }
    }

    //耐久力の低い障害物を配置
    for (
      let i = 0;
      i <
      Math.floor(
        this.STAGE_WIDTH /
          this.TILE_SIZE /
          this.TILE_SPAN_SCALE
      );
      i = i + 1
    ) {
      for (
        let j = 0;
        j <
        Math.floor(
          this.STAGE_HEIGHT /
            this.TILE_SIZE /
            this.TILE_SPAN_SCALE
        );
        i % 2 !== 0 ? (j = j + 2) : (j = j + 1)
      ) {
        // 1/5の確率で障害物を置く
        const willPut = MathUtil.getRandomInt(0, 4);
        if (willPut >= 1) continue;

        const x =
          i * this.TILE_SIZE * this.TILE_SPAN_SCALE +
          this.TILE_SIZE * 0.5 +
          extra;
        const y =
          j * this.TILE_SIZE * this.TILE_SPAN_SCALE +
          this.TILE_SIZE * 0.5 +
          extra;

        //後で双方向リストに書き換えて計算量減らしたい
        const obstacleArr = Array.from(this.obstacleSet);
        const id =
          obstacleArr.length <= 0
            ? 0
            : obstacleArr[obstacleArr.length - 1].id + 1;

        //障害物の種類をランダムに決定
        const obstacleLevel = MathUtil.getRandomInt(1, 3);

        let obstacle = null;
        switch (obstacleLevel) {
          case 3:
            obstacle =
              this.obstacleFactory.createThirdObstacle(
                id,
                x,
                y
              );
            break;
          case 2:
            obstacle =
              this.obstacleFactory.createSecondObstacle(
                id,
                x,
                y
              );
            break;
          case 1:
            obstacle =
              this.obstacleFactory.createFirstObstacle(
                id,
                x,
                y
              );
            break;
        }
        if (obstacle) this.obstacleSet.add(obstacle);
      }
    }
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
  updateObjects(deltaTime: number) {
    //プレイヤーごとの処理
    this.playerSet.forEach((player) => {
      player.update(deltaTime, this.obstacleSet);
    });
    //npxごとの処理
    this.npcSet.forEach((npc) => {
      npc.update(
        deltaTime,
        this.obstacleSet,
        this.playerSet
      );
    });
    // // タンクごとの処理
    // this.tankSet.forEach((tank) => {
    //   tank.update(deltaTime, this.tankobstacleSet);
    // });

    // //ボットごとの処理
    // this.botSet.forEach((bot) => {
    //   bot.update(deltaTime, this.tankobstacleSet);
    // });

    // // 弾丸ごとの処理
    // this.bulletSet.forEach((bullet) => {
    //   const bDisappear = bullet.update(
    //     deltaTime,
    //     this.tankobstacleSet
    //   );
    //   if (bDisappear) {
    //     // 消失
    //     this.destroyBullet(bullet);
    //   }
    // });
  }

  //clientIdが一致するプレイヤーに動作(movement)をセットする
  movePlayer(clientId: string, movement: Movement) {
    this.playerSet.forEach((player) => {
      console.log(
        `player.clientId === clientId : ${
          player.clientId === clientId
        }`
      );
      if (player.clientId && player.clientId === clientId) {
        player.setMovement(movement);
      }
    });
  }

  // moveTank(clientId: string, objMovement: any) {
  //   this.tankSet.forEach((tank) => {
  //     console.log(
  //       'tank.clientId === clientId : ',
  //       tank.clientId === clientId
  //     );
  //     if (tank.clientId && tank.clientId === clientId) {
  //       tank.objMovement = objMovement;
  //     }
  //   });
  // }

  // newBotTankId() {
  //   this.botId++;
  //   return this.botId;
  // }

  //プレイヤーの作成
  createPlayer(clientId: string, userName: string) {
    const playerArr = Array.from(this.playerSet);
    const id =
      playerArr.length === 0
        ? 0
        : playerArr[playerArr.length - 1].id + 1;
    const player = new Player(
      id,
      clientId,
      userName,
      this.obstacleSet
    );
    console.log('プレイヤーが作成されました。');

    this.playerSet.add(player);

    return player;
  }

  createNpc() {
    const npcArr = Array.from(this.npcSet);
    const id =
      npcArr.length === 0
        ? 0
        : npcArr[npcArr.length - 1].id + 1;
    const npc = new Npc(id, this.obstacleSet);

    this.npcSet.add(npc);
    return npc;
  }

  // タンクの生成
  // createTank(clientId: string, userName: string) {
  //   const tankArr = Array.from(this.tankSet);
  //   const id =
  //     tankArr.length === 0
  //       ? 0
  //       : tankArr[tankArr.length - 1].id + 1;
  //   // タンクの生成
  //   const tank = new Tank(
  //     id,
  //     clientId,
  //     userName,
  //     this.tankobstacleSet
  //   );
  //   console.log('tankが作成されました', tank);

  //   // タンクリストへの登録
  //   this.tankSet.add(tank);

  //   return tank;
  // }

  // ボットタンクの生成
  // createBotTank(userName: string) {
  //   // ボットタンクの生成
  //   const bot = new BotTank(
  //     this.newBotTankId(),
  //     userName,
  //     this.tankobstacleSet
  //   );

  //   // タンクリストへの登録
  //   this.botSet.add(bot);
  // }

  //プレイヤーの破棄
  destroyPlayer(clientId: string) {
    this.playerSet.forEach((player) => {
      if (player.clientId === clientId) {
        //プレイヤーリストから削除
        this.playerSet.delete(player);

        //削除したプレイヤーのクライアントに"dead"イベントを送信
        this.roomManager.ioNspGame
          .to(player.clientId)
          .emit('dead');

        //clientIdのプレイヤーSpriteを破棄するようにクライアントに指示する
        this.roomManager.ioNspGame
          .in(this.roomId)
          .emit('deadPlayer', { clientId: clientId });
      }
    });
  }

  // タンクの破棄
  // destroyTank(clientId: string) {
  //   this.tankSet.forEach((tank) => {
  //     if (tank.clientId === clientId) {
  //       // タンクリストリストからの削除
  //       this.tankSet.delete(tank);

  //       // 削除タンクのクライアントにイベント'dead'を送信
  //       this.roomManager.ioNspGame
  //         .to(tank.clientId)
  //         .emit('dead');
  //     }
  //   });
  // }

  // destroyBotTank(id: number) {
  //   this.botSet.forEach((bot) => {
  //     if (bot.id === id) {
  //       this.botSet.delete(bot);

  //       // ボット
  //       // タイマーを設置し、新たなボットを生成する。
  //       setTimeout(() => {
  //         this.createBotTank(bot.userName);
  //       }, ServerConfig.BOTTANK_WAIT_FOR_NEW_BOT); // 3秒後に、新たなボット生成。
  //     }
  //   });
  // }

  //爆弾を作成
  // createBomb(clientId: string) {
  //   if (clientId === '') return;
  //   this.playerSet.forEach((player) => {
  //     if (player.clientId && player.clientId === clientId) {
  //       const bomb = player.putBomb();
  //       if (bomb) {
  //         this.bombSet.add(bomb);
  //       }
  //     }
  //   });
  // }

  // 弾丸の生成
  // createBullet(clientId: string, id: number) {
  //   if (clientId !== '') {
  //     this.tankSet.forEach((tank) => {
  //       if (tank.clientId && tank.clientId === clientId) {
  //         const bullet = tank.shoot();
  //         if (bullet) {
  //           this.bulletSet.add(bullet);
  //         }
  //       }
  //     });
  //   } else {
  //     this.botSet.forEach((bot) => {
  //       if (bot.id === id) {
  //         const bullet = bot.shoot();
  //         if (bullet) {
  //           this.bulletSet.add(bullet);
  //         }
  //       }
  //     });
  //   }
  // }

  //爆弾を破棄
  //   destroyBomb(bomb:Bomb)
  // {
  //   this.bombSet.delete(bomb)
  // }
  //   // 弾丸の破棄
  //   destroyBullet(bullet: Bullet) {
  //     // 弾丸リストからの削除
  //     this.bulletSet.delete(bullet);
  //   }

  // 衝突のチェック
  checkCollisions() {
    //爆風ごとの処理
    // this.explosionSet.forEach((explosion) => {
    //   this.playerSet.forEach((player) => {
    //     if (
    //       OverlapTester.overlapRects(
    //         player.rectBound,
    //         explosion.rectBound
    //       )
    //     ) {
    //       if (player.damage() <= 0) {
    //         this.destroyPlayer(player.clientId);
    //         //5ptゲット
    //         explosion.player.score += 5;
    //       }
    //     }
    //   });
    //   this.npcSet.forEach((npc) => {
    //     if (
    //       OverlapTester.overlapRects(
    //         npc.rectBound,
    //         explosion.rectBound
    //       )
    //     ) {
    //       if (npc.damage() <= 0) {
    //         this.destroyNpc(npc.id);
    //         //1ptゲット
    //         explosion.player.score++;
    //       }
    //     }
    //   });
    // });
    // // 弾丸ごとの処理
    // this.bulletSet.forEach((bullet) => {
    //   // タンクごとの処理
    //   this.tankSet.forEach((tank) => {
    //     if (tank !== bullet.tank) {
    //       // 発射元のタンクとの衝突処理はなし
    //       if (
    //         OverlapTester.overlapRects(
    //           tank.rectBound,
    //           bullet.rectBound
    //         )
    //       ) {
    //         // 衝突
    //         if (0 === tank.damage()) {
    //           // ライフ無くなった
    //           // タンクの削除
    //           this.destroyTank(tank.clientId);
    //         }
    //         this.destroyBullet(bullet);
    //         bullet.tank.iScore++; // 当てたタンクの得点を加算する
    //       }
    //     }
    //   });
    //   //ボットごとの処理
    //   this.botSet.forEach((bot) => {
    //     if (bot !== bullet.tank) {
    //       if (
    //         OverlapTester.overlapRects(
    //           bot.rectBound,
    //           bullet.rectBound
    //         )
    //       ) {
    //         if (bot.damage() === 0) {
    //           this.destroyBotTank(bot.id);
    //         }
    //         this.destroyBullet(bullet);
    //         bullet.tank.iScore++;
    //       }
    //     }
    //   });
    // });
  }

  // 新たな行動
  //特定の条件で敵の動きを変化させるとか
  doNewActions(deltaTime: number) {
    // // ボットは、新たな弾丸を打つかも
    // this.botSet.forEach((bot) => {
    //   if (
    //     ServerConfig.BOTTANK_SHOOT_PROBABILITY_PER_SEC *
    //       deltaTime >
    //     Math.random()
    //   ) {
    //     // 1秒でN発の発射確率で発射する。（N = GameSettings.BOTTANK_SHOOT_PROBABILITY_PER_SEC）
    //     this.createBullet(bot.clientId, bot.id);
    //   }
    // });
  }

  //次のステージへ移動するメソッド
  // nextStage(){
  //     GameManager.switchStage(this.stageFactory.secondStage(),  this.playerSet)
  // }
}
