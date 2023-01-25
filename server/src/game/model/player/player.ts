import { GenericLinkedList } from '../../../linkedList/generic/genericLinkedList';
import RoomManager from '../../../manager/roomManager';
import { CustomSocket } from '../../../socket/interface/customSocket.interface';
import { Movement } from '../../types/movement.type';
import { ObjectUtil } from '../../util/object.util';
import { OverlapUtil } from '../../util/overlap.util';
import { Bomb } from '../bomb';
import { Character } from '../character/character';
import { Explosion } from '../explosion';
import { GenericItem } from '../item/genericItem';
import { Npc } from '../npc/npc';
import { GenericObstacle } from '../obstacle/generic/genericObstacle';

export class Player extends Character {
  static readonly SPRITE_KEY = 'player';
  private movement: Movement = {
    up: false,
    right: false,
    down: false,
    left: false,
  };

  items = {
    bombUp: 0,
    fireUp: 0,
    speedUp: 0,
  };

  public clientId = '';

  public bombList = new GenericLinkedList<Bomb>();
  private bombCountMax = 1;
  private score = 0;

  private bombStrength = 1;

  // コンストラクタ
  constructor(
    public id: number,
    public socket: CustomSocket,
    public userName: string,
    x: number,
    y: number,
    obstacleList: GenericLinkedList<GenericObstacle>,
    stageWidth: number,
    stageHeight: number
  ) {
    super(x, y, Player.SPRITE_KEY, obstacleList, stageWidth, stageHeight);

    this.clientId = socket.clientId!;
    this.setLife = 3;
    this.setInitLife = 3;
  }

  // 更新
  update(
    deltaTime: number,
    obstacleList: GenericLinkedList<GenericObstacle>,
    squareCache: Array<Array<GenericObstacle | null>>,
    bombList: GenericLinkedList<Bomb>,
    explosionList: GenericLinkedList<Explosion>,
    itemList: GenericLinkedList<GenericItem>,
    roomManager: RoomManager,
    roomId: string
  ) {
    //ダメージを受けて3秒間は次のダメージを受けないように設定しているので、
    //3秒を過ぎたら０に戻す
    if (this.getNoDamageTime >= 3) {
      this.setNoDamageTime = 0;
    } else if (this.getNoDamageTime > 0) {
      this.setNoDamageTime = this.getNoDamageTime + deltaTime;
    }
    // 移動前座標値のバックアップ
    const prevPosition = {
      x: this.getPosition.x,
      y: this.getPosition.y,
    };

    //movementにtrueの値がない（動作がない）場合
    if (!Object.values(this.movement).some((value) => value)) {
      this.setVelocity(0, 0);
      //キーが押されていない時
      switch (this.getDirection) {
        case 0:
          this.animTurnUp();
          break;
        case 1:
          this.animTurnRight();
          break;
        case 2:
          this.animTurnDown();
          break;
        case 3:
          this.animTurnRight();
          break;
      }
    }

    // movementによって、プレイヤーの向きと位置を更新
    if (this.movement.up) {
      this.setDirection = 0;
      this.setVelocity(0, -this.getSpeed);
      this.animWalkUp();
    }
    if (this.movement.right) {
      this.setDirection = 1;
      this.setVelocity(this.getSpeed, 0);
      this.animWalkRight();
    }
    if (this.movement.down) {
      this.setDirection = 2;
      this.setVelocity(0, this.getSpeed);
      this.animWalkDown();
    }
    if (this.movement.left) {
      this.setDirection = 3;
      this.setVelocity(-this.getSpeed, 0);
      this.animWalkRight();
    }
    //衝突判定の前に動作を実行する
    this.move(deltaTime);

    //衝突判定
    let collision = false;
    //移動補正値
    let correction = {
      x: 0,
      y: 0,
    };
    // ステージの外に出た場合
    if (
      !OverlapUtil.pointInRect(this.getRectField, {
        x: this.getPosition.x,
        y: this.getPosition.y,
      })
    ) {
      collision = true;
    }
    //爆弾と衝突した場合
    if (this.overlapBombs(bombList)) {
      //爆弾を置いたばかりかどうか
      if (!this.getIsJustPutBomb) {
        //爆弾と衝突
        collision = true;
      }
    }
    //障害物と衝突した場合
    if (this.overlapObstacles(obstacleList)) {
      //衝突した障害物
      let obstacleNode = this.overlapObstacles(obstacleList);
      if (obstacleNode) {
        // 障害物に当たった。
        collision = true;

        //移動補正値を計算
        ObjectUtil.calCorrection(squareCache, obstacleNode, this, correction);
      }
    }
    //衝突した場合は元の位置に戻す
    if (collision) {
      this.setPosition(
        prevPosition.x + correction.x,
        prevPosition.y + correction.y
      );
      this.setVelocity(0, 0);
    }

    //爆風との干渉
    let explosion = this.overlapExplosions(explosionList);
    if (explosion) {
      if (this.getNoDamageTime <= 0) {
        console.log('爆風を受けました');
        //残機を減らす
        this.damage();
        this.setNoDamageTime = deltaTime;
        //干渉した爆風を削除
        explosionList.remove(explosion);
        roomManager.ioNspGame.in(roomId).emit('destroyExplosion', {
          id: explosion.data.id,
        });
      }
    }

    //アイテムとの干渉
    let item = this.overlapItems(itemList);
    if (item) {
      //アイテム効果発動
      item.data.effect(this);
      itemList.remove(item);
      //クライアントからアイテムを削除
      roomManager.ioNspGame.in(roomId).emit('destroyItem', {
        id: item.data.id,
      });
      //持っているアイテムの状態を送信
      roomManager.ioNspGame
        .to(this.socket.id)
        .emit('itemState', { items: this.items });
    }
  }

  //アイテムとの干渉チェック
  overlapItems(itemList: GenericLinkedList<GenericItem>) {
    let iterator = itemList.getHead();
    while (iterator !== null) {
      if (OverlapUtil.overlapRects(this.rectBound, iterator.data.rectBound)) {
        return iterator;
      }
      iterator = iterator.next;
    }
    return null;
  }

  toJSON() {
    return Object.assign(super.toJSON(), {
      clientId: this.socket.clientId,
      userName: this.userName,
      score: this.score,
      items: this.items,
    });
  }

  //ボムの強さ
  get getBombStrength(): number {
    return this.bombStrength;
  }

  get getBombCountMax(): number {
    return this.bombCountMax;
  }

  set setBombCountMax(value: number) {
    this.bombCountMax = value;
  }

  set setBombStrength(value: number) {
    this.bombStrength = value;
  }

  setMovement(movement: Movement): void {
    this.movement = movement;
  }

  // 爆弾を置く
  putBomb(id: number) {
    if (!this.canPutBomb()) {
      return null;
    }

    this.setIsJustPutBomb = true;

    const bomb = new Bomb(id, this.getPosition.x, this.getPosition.y, this);
    this.bombList.pushBack(bomb);
    return new Bomb(id, this.getPosition.x, this.getPosition.y, this);
  }

  // 爆弾を置けるかどうか
  private canPutBomb() {
    return this.bombList.size() < this.bombCountMax;
  }
}
