import config from './config';

export const createGame = async () => {
  const Phaser = await import('phaser');

  const game = new Phaser.Game(config);

  //状態管理のメソッド登録を記述

  return game;
};
