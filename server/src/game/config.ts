import '@geckos.io/phaser-on-nodejs'
import Phaser from 'phaser';
const DEFAULT_WIDTH = 1280;
const DEFAULT_HEIGHT = 720;

export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.HEADLESS,
    parent: 'phaser-game',
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    physics: {
        default: "arcade"
    }

};