import LobbyScene from '../scene/LobbyScene';
import MultiScene from '../scene/MultiScene';
import PreloadScene from '../scene/PreloadScene';

const DEFAULT_WIDTH = 1280;
const DEFAULT_HEIGHT = 720;

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: '#a9a9a9',
  scale: {
    parent: 'phaser-game',
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  },
  scene: [PreloadScene, LobbyScene, MultiScene],
};
export default config;
