export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};
export type GameState = {
  player: {
    name: string[];
    spriteKey: string[]; //Phaserが読み込むオブジェクト画像のキー
    stock: number[]; // 残機
    speed: number[]; // 速さ
  };
  bomb: {
    putOnce: number[]; // 1度に置ける個数
    range: number[]; // 爆発の範囲
    power: number[]; // 爆弾の威力
  };
  stage: { type: string[]; level: number[] }; // 現在のステージ
  time: number[]; // プレイ時間
  killCount: number[]; // 倒した敵の数
};

//useGameStoreが持つ状態とメソッドの型
export type GameStore = {
  gameState: GameState;
  resetGameState: () => void;

  setPlayerName: (s: string, i: number) => void;
  setPlayerSpriteKey: (s: string, i: number) => void;
  setPlayerStock: (n: number, i: number) => void;
  setPlayerSpeed: (n: number, i: number) => void;
  setBombPutOnce: (n: number, i: number) => void;
  setBombRange: (n: number, i: number) => void;
  setBombPower: (n: number, i: number) => void;
  setStageType: (s: string, i: number) => void;
  setStageLevel: (n: number, i: number) => void;
  setKillCount: (n: number, i: number) => void;
};
