import create from 'zustand';
import { SocketStore } from '../types/useSocketStore.type';

export const useSocketStore = create<SocketStore>(
  (set) => ({
    //初期値
    socketState: {
      socket: null,
    },

    updateSocketState: (payload) =>
      set({
        socketState: {
          socket: payload.socket,
        },
      }),

    resetSocketState: () =>
      set({
        socketState: {
          socket: null,
        },
      }),
  })
);
