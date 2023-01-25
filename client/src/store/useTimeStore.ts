import create from 'zustand';
import { TimeStore } from './types/useTimeStore.type';

export const useTimeStore = create<TimeStore>((set) => ({
  //初期値
  timeState: {
    time: 0,
  },

  updateTimeState: (payload) =>
    set({
      timeState: {
        time: payload.time,
      },
    }),

  resetTimeState: () =>
    set({
      timeState: {
        time: 0,
      },
    }),
}));
