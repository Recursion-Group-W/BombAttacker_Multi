  
import { Namespace } from 'socket.io'
  
  import { v4 as uuidv4 } from 'uuid'
import { MAX_PLAYERS_PER_ROOM } from '../game/constants'
import { createGame } from '../game/createGame'
import MultiScene from '../game/scene/MultiScene'
import { RoomMap } from '../types/multiGame.type'
  
  export default class RoomManager {
    roomMap: RoomMap = {}
  
    constructor(public ioNspGame: Namespace) {
    }
  
    generateClientId(socket: any) {
      let clientId: string = uuidv4()
      
      socket.clientId = clientId
      socket.emit('clientId', clientId)
    }
  
    async joinRoom(socket: any, scene: string) {
      if (typeof scene !== 'string') {
        console.error('sceneが正しくありません。')
        return
      }
      socket.roomId = this.chooseRoom(scene)
  
      // 部屋が存在しなければ、新規作成する
      if (!this.roomMap[socket.roomId]) {
        await this.createRoom(socket.roomId, scene)
      }
  
      // this.addUser(socket)

      // this.rooms[socket.room].scene?.events.emit('createPlayer', socket.clientId, socket.id)
    }
  
  
   
  
    async createRoom(roomId: string, scene: string): Promise<void> {
      console.log(`対戦ルーム<roomId: ${roomId}>が新規作成されました。`)
  
      let game: Phaser.Game = createGame(this, roomId, {scene})
  
      this.roomMap[roomId] = {
        sceneKey: scene,
        roomId: roomId,
        users: {},
        game: game,
        scene: game.scene.keys['MultiScene'] as MultiScene,
      }
  
      console.log(`Room ${roomId} created!`)
    }
  
  
    // //空いている部屋を探して部屋番号を返す
    chooseRoom(scene: string): string{
      const roomIdArr:string[] = Object.keys(this.roomMap)
  
      //部屋がない場合、新規作成する
      if (roomIdArr.length === 0) return uuidv4()
  
      let chosenRoom:string | null = null
      for(let roomId in this.roomMap){
        let room = this.roomMap[roomId]
        const userCount = Object.keys(room.users).length
        if (userCount < MAX_PLAYERS_PER_ROOM && room.sceneKey === scene) {
          chosenRoom = roomId
          break
        }
      }
      if (chosenRoom) return chosenRoom
      return uuidv4()
    }
  
    
  
  }