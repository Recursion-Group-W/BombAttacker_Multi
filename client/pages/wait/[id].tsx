import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';

import React, { useEffect, useState, FC } from 'react';
import { io } from 'socket.io-client';

import { Layout } from '../../component/Layout';
import { NODE_URL } from '../../env';
import Copyright from '../../src/Copyright';
import { CustomSocket } from '../../src/socket/interface/customSocket.interface';
import { useSocketStore } from '../../src/store/useSocketStore';
import Link from '../../src/Link';
// パス
import { db } from '../../src/firebase';
import { doc, updateDoc } from 'firebase/firestore';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { TwitterShareButton } from 'react-share';
import TwitterIcon from 'react-share/lib/TwitterIcon';
import { Container } from '@mui/system';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  //   padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />;
});

const WaitGather = () => {
  const router = useRouter();
  const { id } = router.query;

  const [userName, setUserName] = useState('NoName');
  const [open, setOpen] = useState(true);
  const [roomId, setRoomId] = useState('');
  const [standby, setStandby] = useState(false);

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const openDialog = async () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const handleClick = () => {
    const uid = localStorage.getItem('userId')!.toString();
    updateDoc(doc(db, 'users', uid), {
      name: userName != '' ? userName : 'NoName',
    }).catch((error) => {
      console.log(error.message);
    });
  };

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

  const readyToGo = () => {
    setStandby(true);
  };
  const makeOver = () => {
    setStandby(false);
  };
  socket.on('roomId', (roomId: string) => {
    router.push(`/room/${roomId}`);
  });

  useEffect(() => {
    const { id } = router.query;
    console.log('userID: ', id);
  }, [router.query]);

  return (
    <Layout title='WaitGather'>
      <Container>
        <Box
          height='100vh'
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Item>
                <Box maxWidth='sm' p={2}>
                  <Typography variant='h4' component='h1' gutterBottom>
                    表示名
                  </Typography>
                  <input
                    onChange={handleChangeName}
                    value={userName}
                    placeholder='NoName'
                  />
                  <div>
                    <Button
                      variant='contained'
                      color='success'
                      size='large'
                      onClick={handleClick}
                    >
                      <Typography variant='h4' component='h1' gutterBottom>
                        決定
                      </Typography>
                    </Button>
                  </div>
                </Box>
              </Item>
            </Grid>
            <Grid item xs={6}>
              <Item>
                <Box maxWidth='sm' p={2}>
                  <Button
                    variant='contained'
                    color='success'
                    size='large'
                    onClick={openDialog}
                  >
                    <Typography variant='h4' component='h1' gutterBottom>
                      部屋を作る
                    </Typography>
                  </Button>
                </Box>
              </Item>
              <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                fullWidth
                aria-describedby='alert-dialog-slide-description'
              >
                <DialogTitle>{'Waiting...'}</DialogTitle>
                <DialogContent>
                  <DialogContentText id='alert-dialog-slide-description'>
                    表示名：{userName}
                  </DialogContentText>
                  <DialogContentText id='alert-dialog-slide-description'>
                    ID：{roomId}
                  </DialogContentText>
                  <TwitterShareButton
                    url={'http://localhost:3000/room/' + roomId}
                    title={'BombAttackerでマルチ対戦の相手を探しています。'}
                    hashtags={['BombAttacker', 'multi_play']}
                  >
                    <TwitterIcon size={32} round />
                  </TwitterShareButton>
                </DialogContent>
                <DialogActions>
                  {!standby ? (
                    <Grid container>
                      <Grid item xs={6}>
                        <Button fullWidth>退室する</Button>
                      </Grid>
                      <Grid item xs={6}>
                        <Button
                          variant='contained'
                          fullWidth
                          onClick={() => readyToGo()}
                        >
                          準備完了
                        </Button>
                      </Grid>
                    </Grid>
                  ) : (
                    <Button
                      variant='contained'
                      fullWidth
                      onClick={() => makeOver()}
                    >
                      戻る
                    </Button>
                  )}
                </DialogActions>
              </Dialog>
            </Grid>
            <Grid item xs={6}>
              <Item>
                <Box maxWidth='sm' p={2}>
                  <Button
                    variant='contained'
                    component={Link}
                    noLinkStyle
                    color='success'
                    size='large'
                    href={`/score/${id}`}
                  >
                    <Typography variant='h4' component='h1' gutterBottom>
                      スコア
                    </Typography>
                  </Button>
                </Box>
              </Item>
            </Grid>
            <Grid item xs={6}>
              <Item>
                <Box maxWidth='sm' p={2}>
                  <Button
                    variant='contained'
                    component={Link}
                    noLinkStyle
                    color='success'
                    size='large'
                    href={`/ranking`}
                  >
                    <Typography variant='h4' component='h1' gutterBottom>
                      ランキング
                    </Typography>
                  </Button>
                </Box>
              </Item>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Layout>
  );
};

export default WaitGather;
