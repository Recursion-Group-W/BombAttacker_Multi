import { CustomSocket } from '../../socket/interface/customSocket.interface';

export type SocketState = {
  socket: CustomSocket | null;
};

//useGameStoreが持つ状態とメソッドの型
export type SocketStore = {
  socketState: SocketState;
  resetSocketState: () => void;

  updateSocketState: (payload: SocketState) => void;
};
