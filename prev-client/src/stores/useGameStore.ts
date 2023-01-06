import create from 'zustand';
import * as R from 'ramda';
import {
  DeepPartial,
  GameStore,
} from '../types/useGameStore.type';

//プレイ中のゲームの状態を管理
export const useGameStore = create<GameStore>((set) => ({
  //初期値
  gameState: {
    player: {
      name: ['Recursion'],
      spriteKey: [''],
      stock: [0], // 残機

      speed: [0], // 速さ
    },
    bomb: {
      putOnce: [0], // 1度に置ける個数
      range: [0], // 爆発の範囲
      power: [0], // 爆弾の威力
    },
    stage: { type: [''], level: [0] }, // 現在のステージ
    time: [0], // プレイ時間
    killCount: [0], // 倒した敵の数
  },

  //状態をリセットするメソッド
  resetGameState: () =>
    set({
      gameState: {
        player: {
          name: [''],
          spriteKey: [''],
          stock: [0],

          speed: [0],
        },
        bomb: {
          putOnce: [0],
          range: [0],
          power: [0],
        },
        stage: { type: [''], level: [0] },
        time: [0],
        killCount: [0],
      },
    }),

  setPlayerName: (s: string, i: number) => {
    set(
      (state) =>
        R.mergeDeepRight<GameStore, DeepPartial<GameStore>>(
          state,
          {
            gameState: {
              player: {
                name: R.update(
                  i,
                  s,
                  state.gameState.player.name
                ),
              },
            },
          }
        ) as GameStore
    );
  },
  setPlayerSpriteKey: (s: string, i: number) => {
    set(
      (state) =>
        R.mergeDeepRight<GameStore, DeepPartial<GameStore>>(
          state,
          {
            gameState: {
              player: {
                spriteKey: R.update(
                  i,
                  s,
                  state.gameState.player.spriteKey
                ),
              },
            },
          }
        ) as GameStore
    );
  },
  setPlayerStock: (n: number, i: number) => {
    set(
      (state) =>
        R.mergeDeepRight<GameStore, DeepPartial<GameStore>>(
          state,
          {
            gameState: {
              player: {
                stock: R.update(
                  i,
                  n,
                  state.gameState.player.stock
                ),
              },
            },
          }
        ) as GameStore
    );
  },
  setPlayerSpeed: (n: number, i: number) => {
    set(
      (state) =>
        R.mergeDeepRight<GameStore, DeepPartial<GameStore>>(
          state,
          {
            gameState: {
              player: {
                speed: R.update(
                  i,
                  n,
                  state.gameState.player.speed
                ),
              },
            },
          }
        ) as GameStore
    );
  },
  setBombPutOnce: (n: number, i: number) => {
    set(
      (state) =>
        R.mergeDeepRight<GameStore, DeepPartial<GameStore>>(
          state,
          {
            gameState: {
              bomb: {
                putOnce: R.update(
                  i,
                  n,
                  state.gameState.bomb.putOnce
                ),
              },
            },
          }
        ) as GameStore
    );
  },
  setBombRange: (n: number, i: number) => {
    set(
      (state) =>
        R.mergeDeepRight<GameStore, DeepPartial<GameStore>>(
          state,
          {
            gameState: {
              bomb: {
                range: R.update(
                  i,
                  n,
                  state.gameState.bomb.range
                ),
              },
            },
          }
        ) as GameStore
    );
  },
  setBombPower: (n: number, i: number) => {
    set(
      (state) =>
        R.mergeDeepRight<GameStore, DeepPartial<GameStore>>(
          state,
          {
            gameState: {
              bomb: {
                power: R.update(
                  i,
                  n,
                  state.gameState.bomb.power
                ),
              },
            },
          }
        ) as GameStore
    );
  },
  setStageType: (s: string, i: number) => {
    set(
      (state) =>
        R.mergeDeepRight<GameStore, DeepPartial<GameStore>>(
          state,
          {
            gameState: {
              stage: {
                type: R.update(
                  i,
                  s,
                  state.gameState.stage.type
                ),
              },
            },
          }
        ) as GameStore
    );
  },
  setStageLevel: (n: number, i: number) => {
    set(
      (state) =>
        R.mergeDeepRight<GameStore, DeepPartial<GameStore>>(
          state,
          {
            gameState: {
              stage: {
                level: R.update(
                  i,
                  n,
                  state.gameState.stage.level
                ),
              },
            },
          }
        ) as GameStore
    );
  },
  setKillCount: (n: number, i: number) => {
    set(
      (state) =>
        R.mergeDeepRight<GameStore, DeepPartial<GameStore>>(
          state,
          {
            gameState: {
              killCount: R.update(
                i,
                n,
                state.gameState.killCount
              ),
            },
          }
        ) as GameStore
    );
  },
}));
