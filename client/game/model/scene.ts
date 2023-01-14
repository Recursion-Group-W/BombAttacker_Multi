import { create } from "domain";
import {Scene} from "phaser";
import { Player } from "./player";

export class GameScene extends Scene{
    public socket: any;
    constructor() {
        super({ key: 'GameScene' })
            // playerRight
        // this.socket.on('', function
        // (movementDate) {
        // Player.anims.play('player-right', true);
        // });            
    };

create(){
    this.initAnimation()
    this.socket = this.registry.get('socket');
    // this.socket.on('', function
    // (movementDate) {
    // Player.anims.play('player-right', true);
    // }); 
    };   

    initAnimation() {
        //アニメーションマネージャー
        this.anims.create({
          key: 'player-right',
          frameRate: 10,
          repeat: 0,
          frames: this.anims.generateFrameNumbers('player', {
            start: 5,
            end: 7,
          }),
        });
        this.anims.create({
          key: 'player-turn-right',
          frameRate: 10,
          repeat: 0,
          frames: [{ key: 'player', frame: 4 }],
        });
        this.anims.create({
          key: 'player-down',
          frameRate: 10,
          repeat: 0,
          frames: this.anims.generateFrameNumbers('player', {
            start: 2,
            end: 3,
          }),
        });
        this.anims.create({
          key: 'player-turn-down',
          frameRate: 10,
          repeat: 0,
          frames: [{ key: 'player', frame: 1 }],
        });
        this.anims.create({
          key: 'player-up',
          frameRate: 10,
          repeat: 0,
          frames: this.anims.generateFrameNumbers('player', {
            start: 8,
            end: 9,
          }),
        });
        this.anims.create({
          key: 'player-turn-up',
          frameRate: 10,
          repeat: 0,
          frames: [{ key: 'player', frame: 0 }],
        });
    
        this.anims.create({
          key: 'enemy-right',
          frameRate: 10,
          repeat: -1,
          frames: this.anims.generateFrameNumbers('enemy', {
            start: 5,
            end: 7,
          }),
        });
        this.anims.create({
          key: 'enemy-turn-right',
          frameRate: 10,
          repeat: 0,
          frames: [{ key: 'player', frame: 4 }],
        });
        this.anims.create({
          key: 'enemy-down',
          frameRate: 10,
          repeat: -1,
          frames: this.anims.generateFrameNumbers('enemy', {
            start: 2,
            end: 3,
          }),
        });
        this.anims.create({
          key: 'enemy-turn-down',
          frameRate: 10,
          repeat: 0,
          frames: [{ key: 'enemy', frame: 1 }],
        });
        this.anims.create({
          key: 'enemy-up',
          frameRate: 10,
          repeat: -1,
          frames: this.anims.generateFrameNumbers('enemy', {
            start: 8,
            end: 9,
          }),
        });
        this.anims.create({
          key: 'enemy-turn-up',
          frameRate: 10,
          repeat: 0,
          frames: [{ key: 'enemy', frame: 0 }],
        });
        this.anims.create({
          key: 'bomb-anime',
          frameRate: 10,
          repeat: 2,
          frames: this.anims.generateFrameNumbers('bomb', {
            start: 0,
            end: 7,
          }),
        });
        this.anims.create({
          key: 'explode-anime',
          frameRate: 20,
          repeat: 0,
          frames: this.anims.generateFrameNumbers('explode', {
            start: 0,
            end: 9,
          }),
        });
    }
}