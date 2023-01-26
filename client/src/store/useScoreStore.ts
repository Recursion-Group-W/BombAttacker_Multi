import create from 'zustand';
import { ScoreStore } from './types/useScoreStore.type';

export const useScoreStore = create<ScoreStore>((set) => ({
  //初期値
  scoreState: {
    attackPlayer: 0,
    attackNpc: 0,
  },

  updateScoreState: (payload) =>
    set({
      scoreState: {
        attackNpc: payload.attackNpc,
        attackPlayer: payload.attackPlayer,
      },
    }),

  resetScoreState: () =>
    set({
      scoreState: {
        attackPlayer: 0,
        attackNpc: 0,
      },
    }),
}));
