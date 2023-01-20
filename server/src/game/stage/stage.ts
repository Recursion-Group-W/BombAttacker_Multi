import { GenericLinkedList } from '../../linkedList/generic/genericLinkedList';
import RoomManager from '../../manager/roomManager';
import { ObstacleFactory } from '../factory/obstacle/interface/obstacleFactory.interface';
import { Npc } from '../model/npc/npc';
import { GenericObstacle } from '../model/obstacle/generic/genericObstacle';
import { Player } from '../model/player/player';
import { Movement } from '../types/movement.type';
import { MathUtil } from '../util/math.util';

export class Stage {
  readonly STAGE_WIDTH = 1160;
  readonly STAGE_HEIGHT = 1160;
  readonly TILE_SIZE = 40;
  readonly TILE_SPAN_SCALE = 1.0;
  readonly WAIT_FOR_NEW_NPC = 1000 * 10; //１０秒
  public playerList = new GenericLinkedList<Player>(); //プレイヤーのリスト
  public npcList = new GenericLinkedList<Npc>(); //Npcのリスト
  public obstacleList = new GenericLinkedList<GenericObstacle>(); //障害物のリスト
  public squareCache: Array<Array<GenericObstacle | null>> = new Array(
    Math.floor(this.STAGE_WIDTH / this.TILE_SIZE)
  ); //ステージマスのキャッシュ(29 * 29 の２次元配列)
  //fillを使うと参照がコピーされて思った挙動にならない
  // public squareCache: Array<Array<GenericObstacle | null>> = new Array(
  //   Math.floor(this.STAGE_WIDTH / this.TILE_SIZE)
  // ).fill(new Array(Math.floor(this.STAGE_HEIGHT / this.TILE_SIZE)).fill(null)); //ステージマスのキャッシュ(29 * 29 の２次元配列)

  constructor(
    public level: number,
    public roomId: string,
    public roomManager: RoomManager
  ) {
    this.initSquareCache();
  }

  // 更新処理
  update(deltaTime: number) {
    // オブジェクトの座標値の更新と衝突チェック
    this.updateObjects(deltaTime, this.squareCache);
  }
  //マスのキャッシュを初期化
  initSquareCache() {
    for (let i = 0; i < this.squareCache.length; i++) {
      this.squareCache[i] = new Array(
        Math.floor(this.STAGE_HEIGHT / this.TILE_SIZE)
      );
    }
  }
  //障害物の生成
  createObstacles(
    stageWidth: number,
    stageHeight: number,
    obstacleFactory: ObstacleFactory
  ) {
    if (!obstacleFactory) return;

    //ステージ余白を均等にするために、余白extraを算出
    const extra = Math.floor(
      (stageWidth % (this.TILE_SIZE * this.TILE_SPAN_SCALE)) / 2
    );

    //マスのid(0 ~ 840)
    let id = 0;
    for (
      let i = 0;
      i < Math.floor(stageWidth / this.TILE_SIZE / this.TILE_SPAN_SCALE);
      i++
    ) {
      const x =
        i * this.TILE_SIZE * this.TILE_SPAN_SCALE +
        this.TILE_SIZE * 0.5 +
        extra;
      for (
        let j = 0;
        j < Math.floor(stageHeight / this.TILE_SIZE / this.TILE_SPAN_SCALE);
        j++
      ) {
        const y =
          j * this.TILE_SIZE * this.TILE_SPAN_SCALE +
          this.TILE_SIZE * 0.5 +
          extra;

        //末尾ノードのidから新しいidを作る
        // const tail = this.obstacleList.peekBack();
        // const id = tail ? tail.id + 1 : 0;

        let obstacle = null;

        if (i % 2 !== 0 && j % 2 !== 0) {
          //耐久力の高い障害物を置く
          obstacle = obstacleFactory.createFourthObstacle(id, x, y);
        } else {
          //耐久力の低い障害物を置く
          // 1/5の確率で置く
          const willPut = MathUtil.getRandomInt(0, 4);
          if (willPut >= 1) {
            id++;
            continue;
          }
          //障害物の種類をランダムに決定
          const obstacleLevel = MathUtil.getRandomInt(1, 3);

          switch (obstacleLevel) {
            case 3:
              obstacle = obstacleFactory.createThirdObstacle(id, x, y);
              break;
            case 2:
              obstacle = obstacleFactory.createSecondObstacle(id, x, y);
              break;
            case 1:
              obstacle = obstacleFactory.createFirstObstacle(id, x, y);
              break;
          }
        }

        if (obstacle) {
          this.obstacleList.pushBack(obstacle);
        }
        this.squareCache[i][j] = obstacle;
        id++;
      }
    }
    console.log('キャッシュ: ', this.squareCache[0]);
    console.log('キャッシュの長さ: ', this.squareCache[0].length);
  }

  //プレイヤーの作成
  createPlayer(clientId: string, userName: string) {
    const tail = this.playerList.getTail();
    const id = tail ? tail.data.id + 1 : 0;
    const player = new Player(id, clientId, userName, this.obstacleList);
    console.log('プレイヤーが作成されました。');

    this.playerList.pushBack(player);

    return player;
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

  createNpcs(
    npcList: GenericLinkedList<Npc>,
    obstacleList: GenericLinkedList<GenericObstacle>,
    count: number
  ) {
    for (let i = 0; i < count; i++) {
      this.createNpc(npcList, obstacleList);
    }
  }

  createNpc(
    npcList: GenericLinkedList<Npc>,
    obstacleList: GenericLinkedList<GenericObstacle>
  ) {
    const tail = npcList.getTail();
    const id = tail ? tail.data.id + 1 : 0;
    const npc = new Npc(id, obstacleList);

    npcList.pushBack(npc);
    return npc;
  }

  destroyNpc(id: number) {
    let iterator = this.npcList.getHead();
    while (iterator !== null) {
      if (iterator.data.id && iterator.data.id === id) {
        //削除 O(1)
        this.npcList.remove(iterator);

        //クライアントからidに対応するspriteを削除する
        this.roomManager.ioNspGame.in(this.roomId).emit('deleteNpc', id);

        //10秒後に新しく生成
        setTimeout(() => {
          this.createNpc(this.npcList, this.obstacleList);
        }, this.WAIT_FOR_NEW_NPC);

        break;
      }
      iterator = iterator.next;
    }
  }

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

  // オブジェクトの座標値の更新
  updateObjects(
    deltaTime: number,
    squareCache: Array<Array<GenericObstacle | null>>
  ) {
    //プレイヤーごとの処理
    let playerIterator = this.playerList.getHead();
    while (playerIterator !== null) {
      playerIterator.data.update(deltaTime, this.obstacleList, squareCache);
      playerIterator = playerIterator.next;
    }
    //npcごとの処理
    let npcIterator = this.npcList.getHead();
    while (npcIterator !== null) {
      npcIterator.data.update(deltaTime, this.obstacleList, this.playerList);
      npcIterator = npcIterator.next;
    }

    //爆弾ごとの処理

    //爆風ごとの処理

    // // 弾丸ごとの処理(爆弾と爆風のコードで参考にする)
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
}
