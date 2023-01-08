import RoomManager from "../manager/roomManager"
import { Stage } from "./stage/stage";

export class Game {
    roomId: string
    roomManager: RoomManager
    stage: Stage;

    constructor(roomId:string, roomManager:RoomManager){
        this.roomId = roomId
        this.roomManager = roomManager
        this.stage = new Stage(1, roomId, roomManager)
    }

    
}