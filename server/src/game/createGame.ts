import '@geckos.io/phaser-on-nodejs'
import RoomManager from '../manager/roomManager';
import { config } from './config';
import MultiScene from './scene/MultiScene';

type CreateGame = (roomManager: RoomManager, roomId: string, options: { scene: string }) => Phaser.Game

export const createGame:CreateGame = (roomManager: RoomManager, roomId: string, options: { scene: string }) => {
  if (options.scene === 'MultiScene') {
    config.scene = [MultiScene]
  }
  if(options.scene === 'SingleScene'){
    // config.scene = [SingleScene]
  }

const game = new Phaser.Game(config)
game.registry.set('gameSetting', { roomManager, roomId })


  return game
}