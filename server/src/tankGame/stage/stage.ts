import RoomManager from '../../manager/roomManager';
import { CommonConfig } from '../commonConfig';
import { BotTank } from '../model/botTank';
import { Bullet } from '../model/bullet';
import { Tank } from '../model/tank';
import { Wall } from '../model/wall';
import { ServerConfig } from '../serverConfig';
import { OverlapTester } from '../util/overlapTester';

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
  tankSet = new Set<Tank>();
  tankId: number = 0;
  wallSet = new Set<Wall>(); // 壁リスト
  bulletSet = new Set<Bullet>();
  botSet = new Set<BotTank>();
  botId: number = 0;
  setNotPlayingSocketID = new Set<string>(); // プレイしていない通信のソケットIDリスト

  constructor(
    level: number,
    roomId: string,
    roomManager: RoomManager
  ) {
    this.level = level;
    this.roomId = roomId;
    this.roomManager = roomManager;

    // 壁の生成
    for (let i = 0; i < ServerConfig.WALL_COUNT; i++) {
      // ランダム座標値の作成
      const fX_left =
        Math.random() *
        (CommonConfig.FIELD_WIDTH -
          CommonConfig.WALL_WIDTH);
      const fY_bottom =
        Math.random() *
        (CommonConfig.FIELD_HEIGHT -
          CommonConfig.WALL_HEIGHT);
      // 壁生成l
      const wall = new Wall(
        fX_left + CommonConfig.WALL_WIDTH * 0.5,
        fY_bottom + CommonConfig.WALL_HEIGHT * 0.5
      );
      // 壁リストへの登録
      this.wallSet.add(wall);
    }

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
    // タンクの可動域
    const rectTankField = {
      left: 0 + CommonConfig.TANK_WIDTH * 0.5,
      bottom: 0 + CommonConfig.TANK_HEIGHT * 0.5,
      right:
        CommonConfig.FIELD_WIDTH -
        CommonConfig.TANK_WIDTH * 0.5,
      top:
        CommonConfig.FIELD_HEIGHT -
        CommonConfig.TANK_HEIGHT * 0.5,
    };

    // タンクごとの処理
    this.tankSet.forEach((tank) => {
      tank.update(deltaTime, rectTankField, this.wallSet);
    });

    //ボットごとの処理
    this.botSet.forEach((bot) => {
      bot.update(deltaTime, rectTankField, this.wallSet);
    });

    // 弾丸の可動域
    const rectBulletField = {
      left: 0 + CommonConfig.BULLET_WIDTH * 0.5,
      bottom: 0 + CommonConfig.BULLET_HEIGHT * 0.5,
      right:
        CommonConfig.FIELD_WIDTH -
        CommonConfig.BULLET_WIDTH * 0.5,
      top:
        CommonConfig.FIELD_HEIGHT -
        CommonConfig.BULLET_HEIGHT * 0.5,
    };

    // 弾丸ごとの処理
    this.bulletSet.forEach((bullet) => {
      const bDisappear = bullet.update(
        deltaTime,
        rectBulletField,
        this.wallSet
      );
      if (bDisappear) {
        // 消失
        this.destroyBullet(bullet);
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

  newTankId() {
    return this.tankId++;
  }
  newBotTankId() {
    this.botId++;
    return this.botId;
  }

  // タンクの生成
  createTank(clientId: string, userName: string) {
    // ゲーム開始。プレイしていない通信のソケットIDリストから削除
    // this.setNotPlayingSocketID.delete(clientId);

    // タンクの可動域
    const rectTankField = {
      left: 0 + CommonConfig.TANK_WIDTH * 0.5,
      bottom: 0 + CommonConfig.TANK_HEIGHT * 0.5,
      right:
        CommonConfig.FIELD_WIDTH -
        CommonConfig.TANK_WIDTH * 0.5,
      top:
        CommonConfig.FIELD_HEIGHT -
        CommonConfig.TANK_HEIGHT * 0.5,
    };

    // タンクの生成
    const tank = new Tank(
      this.newTankId(),
      clientId,
      userName,
      rectTankField,
      this.wallSet
    );
    console.log('tankが作成されました', tank);

    // タンクリストへの登録
    this.tankSet.add(tank);

    return tank;
  }

  // ボットタンクの生成
  createBotTank(userName: string) {
    // タンクの可動域
    const rectTankField = {
      left: 0 + CommonConfig.TANK_WIDTH * 0.5,
      bottom: 0 + CommonConfig.TANK_HEIGHT * 0.5,
      right:
        CommonConfig.FIELD_WIDTH -
        CommonConfig.TANK_WIDTH * 0.5,
      top:
        CommonConfig.FIELD_HEIGHT -
        CommonConfig.TANK_HEIGHT * 0.5,
    };

    // ボットタンクの生成
    const bot = new BotTank(
      this.newBotTankId(),
      userName,
      rectTankField,
      this.wallSet
    );

    // タンクリストへの登録
    this.botSet.add(bot);
  }

  // タンクの破棄
  destroyTank(clientId: string) {
    this.tankSet.forEach((tank) => {
      if (tank.clientId === clientId) {
        // タンクリストリストからの削除
        this.tankSet.delete(tank);

        // ゲーム開始前に戻るので、プレイしていない通信のソケットIDリストに追加
        // this.setNotPlayingSocketID.add(tank.clientId);

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
