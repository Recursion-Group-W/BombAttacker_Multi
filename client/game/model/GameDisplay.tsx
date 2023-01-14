import React, { useEffect, useState } from 'react';
import { useGameStoreUtil } from '../stores';

export const GameDisplay2 = () => {
  const [game, setGame] = useState<Phaser.Game>();

  //Phaserの初期設定を行うメソッド
  const initPhaser = async () => {
    //PhaserとSceneを非同期でインポート
    const Phaser = await import('phaser');
    const { GameScene } = await import(
      './scene'
    );
    const { PreloadScene } = await import(
        './PreloadScene'
      );

    //描画設定
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: 'game',
      width: 800,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: true,
        },
      },
      height: 800,
      pixelArt: true,
      scene: [GameScene,PreloadScene],
      backgroundColor: '#a9a9a9',
      callbacks: {
        // preBoot: (game) => {
        //   // PhaserGameの中からZustandの状態にアクセスできるように登録
        //   game.registry.set('gameState', gameState);
        // },
      },
    };
    const phaserGame = new Phaser.Game(config);

    setGame(phaserGame);
  };

  useEffect(() => {
    initPhaser();
  }, []);
  return (
    <>
      {/* <div id='game' key='game' /> */}
    </>
  );
};