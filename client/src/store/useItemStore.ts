import create from 'zustand';
import { ItemStore } from './types/useItemStore.type';

export const useItemStore = create<ItemStore>((set) => ({
  //初期値
  itemState: {
    fireUp: 0,
    bombUp: 0,
    speedUp: 0,
  },

  updateItemState: (payload) =>
    set({
      itemState: {
        fireUp: payload.fireUp,
        bombUp: payload.bombUp,
        speedUp: payload.speedUp,
      },
    }),

  resetItemState: () =>
    set({
      itemState: {
        fireUp: 0,
        bombUp: 0,
        speedUp: 0,
      },
    }),
}));
