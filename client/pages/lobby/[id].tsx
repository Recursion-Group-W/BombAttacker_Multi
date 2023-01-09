import {
  Box,
  Button,
  Container,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import { NODE_URL } from '../../env';
import Copyright from '../../src/Copyright';
import { useSocketStore } from '../../src/store/useSocketStore';

const Lobby = () => {
  const router = useRouter();

  const updateSocketState = useSocketStore(
    (state) => state.updateSocketState
  );

  const url = NODE_URL;
  const socket = io(`${url}/game`);
  updateSocketState({ socket: socket });

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
    <Container maxWidth='lg'>
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography
          variant='h4'
          component='h1'
          gutterBottom
        >
          Lobby
        </Typography>
        <Box maxWidth='sm'>
          <Button
            variant='contained'
            onClick={() => joinRoom()}
          >
            Join the Room
          </Button>
        </Box>
        <Copyright />
      </Box>
    </Container>
  );
};

export default Lobby;
