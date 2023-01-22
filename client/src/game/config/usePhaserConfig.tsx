import { useSocketStore } from '../../store/useSocketStore';
import { MainScene } from '../scene/MainScene';
import { PreloadScene } from '../scene/PreloadScene';

export const usePhaserConfig = () => {
  //Zustandからsocketを取り出す
  const { socketState } = useSocketStore();
  const socket = socketState.socket;
  //描画設定
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    scale: {
      parent: 'phaser-game',
      width: 1160,
      height: 1160,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false,
      },
    },

    pixelArt: true,
    scene: [PreloadScene, MainScene],
    backgroundColor: '#a9a9a9',
    callbacks: {
      preBoot: (game) => {
        // PhaserGameの中からZustandの状態にアクセスできるように登録
        game.registry.set('socket', socket);
      },
    },
  };
  return { config };
};
