import RoomManager from '../../manager/roomManager';
import { Player } from '../model/player/player';
import { Movement } from '../types/movement.type';
import { FirstStage } from './firstStage';
import { BrickFactory } from '../factory/obstacle/brick/brickFactory';
import { Npc } from '../model/npc/npc';
import { Bomb } from '../model/bomb';

export class FirstPaintStage extends FirstStage {
  // type='paint'
  // background = ""
  obstacleFactory = new BrickFactory(); //障害物を作成するFactory

  // GenericLinkedList<Integer> integerLinkedList = new GenericLinkedList<Integer>();
  constructor(level: number, roomId: string, roomManager: RoomManager) {
    super(level, roomId, roomManager);

    //障害物の生成
    this.createObstacles(
      this.STAGE_WIDTH,
      this.STAGE_HEIGHT,
      this.obstacleFactory
    );

    //npc作成
    //後でfactoryを作成して、npc作成の機能をステージから切り離したい
    this.createNpcs(this.npcList, this.obstacleList, this.NPC_COUNT);
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
    // this.playerSet.forEach((player) => {
    //   player.update(deltaTime, this.obstacleList);
    // });
    let playerIterator = this.playerList.getHead();
    while (playerIterator !== null) {
      playerIterator.data.update(deltaTime, this.obstacleList);
      playerIterator = playerIterator.next;
    }
    //npcごとの処理
    // this.npcSet.forEach((npc) => {
    //   npc.update(deltaTime, this.obstacleList, this.playerSet);
    // });

    let npcIterator = this.npcList.getHead();
    while (npcIterator !== null) {
      npcIterator.data.update(deltaTime, this.obstacleList, this.playerList);
      npcIterator = npcIterator.next;
    }

    //爆弾ごとの処理

    //爆風ごとの処理

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
    let iterator = this.playerList.getHead();
    while (iterator !== null) {
      if (iterator.data.clientId && iterator.data.clientId === clientId) {
        iterator.data.setMovement(movement);

        break;
      }
      iterator = iterator.next;
    }
  }
  // movePlayer(clientId: string, movement: Movement) {
  //   this.playerSet.forEach((player) => {
  //     // console.log(
  //     //   `player.clientId === clientId : ${
  //     //     player.clientId === clientId
  //     //   }`
  //     // );
  //     if (player.clientId && player.clientId === clientId) {
  //       player.setMovement(movement);
  //     }
  //   });
  // }

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
    const tail = this.playerList.getTail();
    const id = tail ? tail.data.id + 1 : 0;
    const player = new Player(id, clientId, userName, this.obstacleList);
    console.log('プレイヤーが作成されました。');

    this.playerList.pushBack(player);

    return player;
  }
  // createPlayer(clientId: string, userName: string) {
  //   const playerArr = Array.from(this.playerSet);
  //   const id =
  //     playerArr.length === 0 ? 0 : playerArr[playerArr.length - 1].id + 1;
  //   const player = new Player(id, clientId, userName, this.obstacleList);
  //   console.log('プレイヤーが作成されました。');

  //   this.playerSet.add(player);

  //   return player;
  // }

  // createNpc(npcSet: Set<Npc>, obstacleSet: Set<GenericObstacle>) {
  //   const npcArr = Array.from(npcSet);
  //   const id = npcArr.length === 0 ? 0 : npcArr[npcArr.length - 1].id + 1;
  //   const npc = new Npc(id, obstacleSet);

  //   npcSet.add(npc);
  //   return npc;
  // }

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
    let iterator = this.playerList.getHead();
    while (iterator !== null) {
      if (iterator.data.clientId === clientId) {
        //プレイヤーリストから削除
        this.playerList.remove(iterator);

        //削除したプレイヤーのクライアントに"dead"イベントを送信
        this.roomManager.ioNspGame.to(iterator.data.clientId).emit('dead');

        //clientIdのプレイヤーSpriteを破棄するようにクライアントに指示する
        this.roomManager.ioNspGame
          .in(this.roomId)
          .emit('deadPlayer', { clientId: clientId });

        break;
      }
      iterator = iterator.next;
    }
  }
  // destroyPlayer(clientId: string) {
  //   this.playerSet.forEach((player) => {
  //     if (player.clientId === clientId) {
  //       //プレイヤーリストから削除
  //       this.playerSet.delete(player);

  //       //削除したプレイヤーのクライアントに"dead"イベントを送信
  //       this.roomManager.ioNspGame.to(player.clientId).emit('dead');

  //       //clientIdのプレイヤーSpriteを破棄するようにクライアントに指示する
  //       this.roomManager.ioNspGame
  //         .in(this.roomId)
  //         .emit('deadPlayer', { clientId: clientId });
  //     }
  //   });
  // }

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
  //   let iterator = this.playerList.getHead();
  //   while (iterator !== null) {
  //     if (iterator.data.clientId && iterator.data.clientId === clientId) {
  //       const bomb = iterator.data.putBomb();
  //       if (bomb) {
  //         this.bombList.pushBack(bomb);
  //       }
  //     }
  //   }
  // }

  //爆弾を破棄
  // destroyBomb(bomb: Bomb) {
  //   this.bombList.remove(bomb)
  // }

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
