import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { Server } from 'socket.io';
import RoomManager from './manager/roomManager';
import IoGame from './socket/ioGame';

const app = express();

app.use(express.json());
app.get('*', (req, res) => {
  res.redirect('https://frontend-bombattacker.an.r.appspot.com/');
});

const httpServer = createServer(app);

const PORT = 5002;

const io = new Server(httpServer, {
  cors: {
    origin: [
      'http://localhost:3000',
      'https://frontend-bombattacker.an.r.appspot.com',
    ],
  },
});

//ゲームに関するソケット通信を行うためのNameSpace
const ioNspGame = io.of('/game');
//Roomを管理するためのroomManager
const roomManager = new RoomManager(ioNspGame);
const ioGame = new IoGame(ioNspGame, roomManager);

httpServer.listen(process.env.PORT || PORT, () => {
  console.log(`Server is runnning PORT:${PORT}`);
});
