import { Game } from "../game/game";

export class GameManager {
    game: Game;

    constructor(game: Game){
        this.game = game
    }
    
    // switchStage(stage: Stage, playerSet: any){
    //     this.game.stage = stage
    //     this.game.stage.playerSet = playerSet
    // }
}