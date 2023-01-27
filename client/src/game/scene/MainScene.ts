import { BombDto } from '../dto/bomb.dto';
import { ExplosionDto } from '../dto/explosion.dto';
import { ItemDto } from '../dto/item.dto';
import { NpcDto } from '../dto/npc.dto';
import { ObstacleDto } from '../dto/obstacle.dto';
import { PlayerDto } from '../dto/player.dto';
import Cursor from '../model/cursor';
import { SyncUtil } from '../util/sync.util';
import { CustomScene } from './parent/customScene';
// import { isGameOver } from '../../../pages/gameOverPage/[id]';
import  { collection, query, where, getDocs, getFirestore } from "firebase/firestore";
import { useRouter } from 'next/router';

// import { db } from '../../../../client/src/firebase';
import { doc, updateDoc } from "firebase/firestore";
const db = getFirestore();
const usersRef = collection(db, "users");
let name = "";
let score = 0;
let pageURL = location.href
const router = useRouter();

const GameOver = () =>{
  getDocs(query(usersRef, where("Life", "==", 0))).then(snapshot => {
    // const router = useRouter();
      snapshot.forEach(Doc => {
          name = Doc.data().name;
          score = Doc.data().score;
          console.log(`${Doc.id}: ${Doc.data().name}`);
          // pageURL +=  '/gameOverPage';
          router.push('/gameOverPage')
          // window.location.href = '/gameOverPage';  
          updateDoc(doc(db, "users", Doc.data().uid), {
            Life: -1
          }) 
      })
    })
  }
export class MainScene extends CustomScene { 
  cursor: Cursor | null = null;

  constructor() {
    super({ key: 'MainScene' });
  }
  init() {
    this.socket = this.registry.get('socket');
    if (this.socket) {
      this.cursor = new Cursor(this, this.socket);
    }
  }

  create() {
    if (!this.socket) return;

    this.socket.emit('getInitialState');

    this.socket.on(
      'syncGame',
      (res: {
        time: number;
        playerArr: PlayerDto[];
        npcArr: NpcDto[];
        obstacleArr: ObstacleDto[];
        bombArr: BombDto[];
        explosionArr: ExplosionDto[];
        itemArr: ItemDto[];
      }) => {
        this.game.events.emit('updateTimeState', { time: res.time });

        SyncUtil.setPlayer(res.playerArr, this);
        SyncUtil.setNpc(res.npcArr, this);
        SyncUtil.setObstacle(res.obstacleArr, this);
        SyncUtil.setBomb(res.bombArr, this);
        SyncUtil.setExplosion(res.explosionArr, this);
        SyncUtil.setItem(res.itemArr, this);
      }
    );

    this.socket.on('destroyBomb', (res: { id: number }) => {
      SyncUtil.destroyBomb(res.id, this);
    });

    this.socket.on('destroyPlayer', (res: { clientId: string }) => {
      console.log(`プレイヤーsprite<clientId: ${res.clientId}>を削除します。`);
      SyncUtil.destroyPlayer(res.clientId, this);
    });

    this.socket.on('destroyNpc', (res: { id: number }) => {
      SyncUtil.destroyNpc(res.id, this);
    });
    this.socket.on('destroyExplosion', (res: { id: number }) => {
      SyncUtil.destroyExplosion(res.id, this);
    });
    this.socket.on('destroyObstacle', (res: { id: number }) => {
      SyncUtil.destroyObstacle(res.id, this);
    });
    this.socket.on('destroyItem', (res: { id: number }) => {
      SyncUtil.destroyItem(res.id, this);
    });
    this.socket.on(
      'updateObstacle',
      (res: { id: number; spriteKey: string }) => {
        SyncUtil.updateObstacle(res.id, res.spriteKey, this);
      }
    );
  }
  update(): void {
    //syncのデータを基に、spriteの座標とアニメーションを更新
    SyncUtil.updatePlayer(this);
    SyncUtil.updateNpc(this);
    SyncUtil.updateBomb(this);
    SyncUtil.updateExplosion(this);
    // GameOver()
    this.cursor?.update();
  }
}
