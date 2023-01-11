export type SocketState = {
  socket: any;
};

//useGameStoreが持つ状態とメソッドの型
export type SocketStore = {
  socketState: SocketState;
  resetSocketState: () => void;

  updateSocketState: (payload: SocketState) => void;
};
