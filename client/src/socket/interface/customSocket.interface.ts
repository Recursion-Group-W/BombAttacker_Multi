import { Socket } from 'socket.io-client';

//今はsocket通信でany型を使ってるので、
//SocketにclientIdなどを追加したCustomSocketの実装が必要

export interface CustomSocket extends Socket {
  clientId?: string;
}
