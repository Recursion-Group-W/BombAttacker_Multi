import RoomManager from "../../manager/roomManager";


export class Stage {
    // name = "normal"
    level:number;
    // background = ""
    // backgroundSet;
    // wallSet;
    // abstacleSet;
    // playerSet;
    // npcSet;
    // stageFactory;
    roomId: string;
    roomManager : RoomManager
    
    constructor(level:number, roomId: string, roomManager: RoomManager){
        this.level = level
        this.roomId = roomId
        this.roomManager = roomManager
    }

    // nextStage(){
    //     GameManager.switchStage(this.stageFactory.secondStage(),  this.playerSet)
    // }
}