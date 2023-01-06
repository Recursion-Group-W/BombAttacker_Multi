import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import RoomManager from './manager/roomManager';
import IoGame from './socket/ioGame';

const app = express();

app.use(express.json())

const httpServer = createServer(app);

const PORT = 5000;

const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3005'],
  },
});

//ゲームに関するソケット通信を行うためのNameSpace
const ioNspGame = io.of('/game');
//Roomを管理するためのroomManager
const roomManager = new RoomManager(ioNspGame)
const ioGame = new IoGame(ioNspGame, roomManager);

httpServer.listen(process.env.PORT || PORT, () => {
  console.log(`Server is runnning PORT:${PORT}`);
});
