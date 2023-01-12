import RoomManager from '../../manager/roomManager';
import { CommonConfig } from '../config/commonConfig';
import { BotTank } from '../model/tank/botTank';
import { Bullet } from '../model/tank/bullet';
import { Tank } from '../model/tank/tank';
import { TankObstacle } from '../model/tank/tankObstacle';
import { ServerConfig } from '../config/serverConfig';
import { OverlapTester } from '../util/overlapTester';
import { Player } from '../model/player';
import { Obstacle } from '../model/obstacle';
import { Movement } from '../../types/movement.type';

export class Stage {
  // name = "normal"
  level: number;
  // background = ""
  // backgroundSet;
  // obstacleSet;
  obstacleSet = new Set<Obstacle>();
  playerSet = new Set<Player>(); //とりあえずSetを使う。あとでDequeを使って修正したい。
  // npcSet;
  // stageFactory;
  roomId: string;
  roomManager: RoomManager;
  tankSet = new Set<Tank>();
  tankobstacleSet = new Set<TankObstacle>();
  bulletSet = new Set<Bullet>();
  botSet = new Set<BotTank>();
  botId: number = 0;

  constructor(
    level: number,
    roomId: string,
    roomManager: RoomManager
  ) {
    this.level = level;
    this.roomId = roomId;
    this.roomManager = roomManager;

    //障害物の生成
    const TILE_SIZE = 32;
    const scale = 1.25;
    const extra = Math.floor(
      (CommonConfig.FIELD_WIDTH % (TILE_SIZE * scale)) / 2
    );
    for (
      let i = 1;
      i <
      Math.floor(
        CommonConfig.FIELD_WIDTH / TILE_SIZE / scale
      ) -
        1;
      i = i + 2
    ) {
      for (
        let j = 1;
        j <
        Math.floor(
          CommonConfig.FIELD_HEIGHT / TILE_SIZE / scale
        ) -
          1;
        j = j + 2
      ) {
        const x =
          i * TILE_SIZE * scale + TILE_SIZE * 0.5 + extra;
        const y =
          j * TILE_SIZE * scale + TILE_SIZE * 0.5 + extra;
        const obstacle = new Obstacle(x, y);
        this.obstacleSet.add(obstacle);
      }
    }
    // console.log('obstacle: ', this.obstacleSet);

    // 壁の生成
    // for (let i = 0; i < ServerConfig.WALL_COUNT; i++) {
    //   // ランダム座標値の作成
    //   const fX_left =
    //     Math.random() *
    //     (CommonConfig.FIELD_WIDTH -
    //       CommonConfig.WALL_WIDTH);
    //   const fY_bottom =
    //     Math.random() *
    //     (CommonConfig.FIELD_HEIGHT -
    //       CommonConfig.WALL_HEIGHT);
    //   // 壁生成l
    //   const wall = new TankObstacle(
    //     fX_left + CommonConfig.WALL_WIDTH * 0.5,
    //     fY_bottom + CommonConfig.WALL_HEIGHT * 0.5
    //   );
    //   // 壁リストへの登録
    //   this.tankobstacleSet.add(wall);
    // }

    // ボットの生成
    for (let i = 0; i < ServerConfig.BOTTANK_COUNT; i++) {
      this.createBotTank('Bot' + (i + 1));
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
    // タンクごとの処理
    this.tankSet.forEach((tank) => {
      tank.update(deltaTime, this.tankobstacleSet);
    });

    //ボットごとの処理
    this.botSet.forEach((bot) => {
      bot.update(deltaTime, this.tankobstacleSet);
    });

    // 弾丸ごとの処理
    this.bulletSet.forEach((bullet) => {
      const bDisappear = bullet.update(
        deltaTime,
        this.tankobstacleSet
      );
      if (bDisappear) {
        // 消失
        this.destroyBullet(bullet);
      }
    });
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

  moveTank(clientId: string, objMovement: any) {
    this.tankSet.forEach((tank) => {
      console.log(
        'tank.clientId === clientId : ',
        tank.clientId === clientId
      );
      if (tank.clientId && tank.clientId === clientId) {
        tank.objMovement = objMovement;
      }
    });
  }

  newBotTankId() {
    this.botId++;
    return this.botId;
  }

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

  // タンクの生成
  createTank(clientId: string, userName: string) {
    const tankArr = Array.from(this.tankSet);
    const id =
      tankArr.length === 0
        ? 0
        : tankArr[tankArr.length - 1].id + 1;
    // タンクの生成
    const tank = new Tank(
      id,
      clientId,
      userName,
      this.tankobstacleSet
    );
    console.log('tankが作成されました', tank);

    // タンクリストへの登録
    this.tankSet.add(tank);

    return tank;
  }

  // ボットタンクの生成
  createBotTank(userName: string) {
    // ボットタンクの生成
    const bot = new BotTank(
      this.newBotTankId(),
      userName,
      this.tankobstacleSet
    );

    // タンクリストへの登録
    this.botSet.add(bot);
  }

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
      }
    });
  }

  // タンクの破棄
  destroyTank(clientId: string) {
    this.tankSet.forEach((tank) => {
      if (tank.clientId === clientId) {
        // タンクリストリストからの削除
        this.tankSet.delete(tank);

        // 削除タンクのクライアントにイベント'dead'を送信
        this.roomManager.ioNspGame
          .to(tank.clientId)
          .emit('dead');
      }
    });
  }
  destroyBotTank(id: number) {
    this.botSet.forEach((bot) => {
      if (bot.id === id) {
        this.botSet.delete(bot);

        // ボット
        // タイマーを設置し、新たなボットを生成する。
        setTimeout(() => {
          this.createBotTank(bot.userName);
        }, ServerConfig.BOTTANK_WAIT_FOR_NEW_BOT); // 3秒後に、新たなボット生成。
      }
    });
  }

  // 弾丸の生成
  createBullet(clientId: string, id: number) {
    if (clientId !== '') {
      this.tankSet.forEach((tank) => {
        if (tank.clientId && tank.clientId === clientId) {
          const bullet = tank.shoot();
          if (bullet) {
            this.bulletSet.add(bullet);
          }
        }
      });
    } else {
      this.botSet.forEach((bot) => {
        if (bot.id === id) {
          const bullet = bot.shoot();
          if (bullet) {
            this.bulletSet.add(bullet);
          }
        }
      });
    }
  }

  // 弾丸の破棄
  destroyBullet(bullet: Bullet) {
    // 弾丸リストからの削除
    this.bulletSet.delete(bullet);
  }

  // 衝突のチェック
  checkCollisions() {
    // 弾丸ごとの処理
    this.bulletSet.forEach((bullet) => {
      // タンクごとの処理
      this.tankSet.forEach((tank) => {
        if (tank !== bullet.tank) {
          // 発射元のタンクとの衝突処理はなし
          if (
            OverlapTester.overlapRects(
              tank.rectBound,
              bullet.rectBound
            )
          ) {
            // 衝突
            if (0 === tank.damage()) {
              // ライフ無くなった
              // タンクの削除
              this.destroyTank(tank.clientId);
            }
            this.destroyBullet(bullet);
            bullet.tank.iScore++; // 当てたタンクの得点を加算する
          }
        }
      });

      //ボットごとの処理
      this.botSet.forEach((bot) => {
        if (bot !== bullet.tank) {
          if (
            OverlapTester.overlapRects(
              bot.rectBound,
              bullet.rectBound
            )
          ) {
            if (bot.damage() === 0) {
              this.destroyBotTank(bot.id);
            }
            this.destroyBullet(bullet);
            bullet.tank.iScore++;
          }
        }
      });
    });
  }

  // 新たな行動
  doNewActions(deltaTime: number) {
    // ボットは、新たな弾丸を打つかも
    this.botSet.forEach((bot) => {
      if (
        ServerConfig.BOTTANK_SHOOT_PROBABILITY_PER_SEC *
          deltaTime >
        Math.random()
      ) {
        // 1秒でN発の発射確率で発射する。（N = GameSettings.BOTTANK_SHOOT_PROBABILITY_PER_SEC）
        this.createBullet(bot.clientId, bot.id);
      }
    });
  }

  // nextStage(){
  //     GameManager.switchStage(this.stageFactory.secondStage(),  this.playerSet)
  // }
}
