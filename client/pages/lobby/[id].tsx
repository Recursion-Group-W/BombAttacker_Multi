import { Box, Button, Container, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import { Layout } from '../../component/Layout';
import { NODE_URL } from '../../env';
import Copyright from '../../src/Copyright';
import { CustomSocket } from '../../src/socket/interface/customSocket.interface';
import { useSocketStore } from '../../src/store/useSocketStore';

const Lobby = () => {
  const router = useRouter();

  const updateSocketState = useSocketStore((state) => state.updateSocketState);

  const url = NODE_URL;
  const socket: CustomSocket = io(`${url}/game`);
  updateSocketState({ socket: socket });

  socket.on('connect', () => {
    console.log('サーバーとソケット接続しました。');
  });
  socket.on('clientId', (clientId: string) => {
    console.log(`Your clientId is ${clientId}`);
    socket.clientId = clientId;
  });

  const joinRoom = async () => {
    socket.emit('joinRoom', {
      userName: 'user1',
      userId: localStorage.getItem('userId'),
    });
  };
  socket.on('roomId', (roomId: string) => {
    router.push(`/room/${roomId}`);
  });

  useEffect(() => {
    const { id } = router.query;
    console.log('userID: ', id);
  }, [router.query]);
  return (
    <Layout title='Lobby'>
      <Container maxWidth='lg'>
        <Box
          height='100vh'
          sx={{
            my: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant='h2' component='h1' gutterBottom>
            ロビー
          </Typography>
          <Box maxWidth='sm'>
            <Button variant='contained' onClick={() => joinRoom()}>
              対戦する
            </Button>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default Lobby;
