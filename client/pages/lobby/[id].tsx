import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import { NODE_URL } from '../../env';

const Lobby = () => {
  const router = useRouter();

  const url = NODE_URL;
  const socket = io(`${url}/game`);
  socket.on('connect', () => {
    console.log('サーバーとソケット接続しました。');
  });
  socket.on('clientId', (clientId: string) => {
    console.log(`Your clientId is ${clientId}`);
    socket.clientId = clientId;
  });

  const joinRoom = async () => {
    socket.emit('joinRoom');
  };
  socket.on('roomId', (roomId: string) => {
    router.push(`/room/${roomId}`);
  });

  useEffect(() => {
    const { id } = router.query;
    console.log('userID: ', id);
  }, [router.query]);
  return (
    <div>
      <h2>Lobby</h2>
      <button onClick={() => joinRoom()}>Join Room</button>
    </div>
  );
};

export default Lobby;