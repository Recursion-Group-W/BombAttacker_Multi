import React, { useEffect, useState } from 'react';
import { useGameStoreUtil } from '../stores';

export const GameDisplay = () => {
  const [game, setGame] = useState<Phaser.Game>();

  //Zustandからゲームの状態とメソッドを取得
  const {
    gameState,
    resetGameState,
    setPlayerName,
    setPlayerSpriteKey,
    setPlayerStock,
    setPlayerSpeed,
    setBombPutOnce,
    setBombRange,
    setBombPower,
    setStageType,
    setStageLevel,
    setKillCount,
  } = useGameStoreUtil();

  //Phaserの初期設定を行うメソッド
  const initPhaser = async () => {
    //PhaserとSceneを非同期でインポート
    const Phaser = await import('phaser');
    const { PreloadScene } = await import(
      '../scenes/PreloadScene'
    );
    const { GameScene } = await import(
      '../scenes/GameScene'
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
      scene: [PreloadScene, GameScene],
      backgroundColor: '#a9a9a9',
      callbacks: {
        preBoot: (game) => {
          // PhaserGameの中からZustandの状態にアクセスできるように登録
          game.registry.set('gameState', gameState);
        },
      },
    };
    const phaserGame = new Phaser.Game(config);

    //Zustandの更新メソッドを"resetGameState"というkeyで登録
    phaserGame.events.on('resetGameState', resetGameState);
    phaserGame.events.on('setPlayerName', setPlayerName);
    phaserGame.events.on(
      'setPlayerSpriteKey',
      setPlayerSpriteKey
    );
    phaserGame.events.on('setPlayerStock', setPlayerStock);
    phaserGame.events.on('setPlayerSpeed', setPlayerSpeed);
    phaserGame.events.on('setBombPutOnce', setBombPutOnce);
    phaserGame.events.on('setBombRange', setBombRange);
    phaserGame.events.on('setBombPower', setBombPower);
    phaserGame.events.on('setStageType', setStageType);
    phaserGame.events.on('setStageLevel', setStageLevel);
    phaserGame.events.on('setKillCount', setKillCount);

    setGame(phaserGame);
  };

  useEffect(() => {
    initPhaser();
  }, []);
  return (
    <>
      {/* <div id='game' key='game' /> */}
      <div>{gameState.player.name[0]}</div>
    </>
  );
};
