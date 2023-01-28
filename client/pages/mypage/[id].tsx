import {
  Box,
  Button,
  Grid,
  Paper,
  styled,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Slide,
  TextField,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { Container } from '@mui/system';
import ShareButtons from '../../component/ShareButtons';

import { useRouter } from 'next/router';
import React, { useEffect, useState, FC, ChangeEvent } from 'react';
import { io } from 'socket.io-client';

import { Layout } from '../../component/Layout';
import { NODE_URL } from '../../env';
import { CustomSocket } from '../../src/socket/interface/customSocket.interface';
import { useSocketStore } from '../../src/store/useSocketStore';
import Link from '../../src/Link';
// パス
import { db } from '../../src/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  //   padding: theme.spacing(1),
  textAlign: 'center',
  width: '100%',
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

const Mypage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [userName, setUserName] = useState('NoName');
  const [userId, setUserId] = useState('');
  const [open, setOpen] = useState(false);
  const [waiting, setWaiting] = useState(0);

  const openDialog = () => {
    if (userName.length === 0) {
      alert('名前を入力してください');
      return;
    }
    setOpen(true);
    socket.emit('standby', { userName: userName, userId: userId });
  };
  const closeDialog = () => {
    setOpen(false);
    if (userId) socket.emit('cancelStandby', userId);
  };
  const handleClick = () => {
    if (userId) {
      updateDoc(doc(db, 'users', userId), {
        name: userName != '' ? userName : 'NoName',
      }).catch((error) => {
        console.log(error.message);
      });
    }
    alert('変更しました');
  };
  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };
  const waitingUser = () => {
    socket.emit('waitingUser', userId);
  };
  const startGame = () => {
    socket.emit('startGame', userId);
  };
  const joinGame = () => {
    socket.emit('joinRoom', {
      userName: userName,
      userId: localStorage.getItem('userId'),
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
  socket.on('waitingUserArr', (waiting: number) => {
    setWaiting(waiting - 1);
  });
  socket.on('cancelGame', () => {
    alert('ゲームがキャンセルされました');
  });
  socket.on('join', (roomId: string) => {
    router.push(`/room/${roomId}`);
  });

  useEffect(() => {
    const { id } = router.query;
    let uid = localStorage.getItem('userId');
    if (uid != null) setUserId(uid);
    console.log('userID: ', id);
  }, [router.query]);

  return (
    <Layout title='Mypage'>
      <Container>
        <Box
          height='100vh'
          width='90%'
          maxWidth='750px'
          margin='auto'
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Item>
            <Grid
              container
              direction='column'
              justifyContent='center'
              alignItems='center'
            >
              <Typography variant='h2' component='h1' gutterBottom>
                MyPage
              </Typography>
              <Grid item xs={6} py={5}>
                <Grid
                  container
                  justifyContent='center'
                  alignItems='center'
                  p={3}
                >
                  <Grid item xs={12}>
                    <Typography variant='h4' component='h1' gutterBottom>
                      表示名
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      error={userName!.length > 6}
                      required
                      fullWidth
                      id='filled-basic'
                      label='Change Name'
                      variant='filled'
                      value={userName}
                      onChange={handleChangeName}
                      helperText='6文字以下にしてください'
                    />
                  </Grid>
                  <Grid item xs={4}>
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
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
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
                <Dialog
                  open={open}
                  TransitionComponent={Transition}
                  keepMounted
                  fullWidth
                  aria-describedby='alert-dialog-slide-description'
                >
                  <DialogTitle variant='h4' component='h1' textAlign='center'>
                    {'Waiting...'}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id='alert-dialog-slide-description'>
                      表示名：{userName}
                    </DialogContentText>
                    <DialogContentText id='alert-dialog-slide-description'>
                      接続人数：{waiting}
                      <Button onClick={waitingUser}>更新する</Button>
                    </DialogContentText>
                    <ShareButtons />
                  </DialogContent>
                  <DialogActions>
                    <Grid container>
                      <Grid item xs={4}>
                        <Button fullWidth onClick={closeDialog}>
                          やめる
                        </Button>
                      </Grid>
                      <Grid item xs={8}>
                        <Button
                          variant='contained'
                          fullWidth
                          onClick={() => startGame()}
                        >
                          ゲーム開始
                        </Button>
                      </Grid>
                    </Grid>
                  </DialogActions>
                </Dialog>
              </Grid>
              {/* <Grid item xs={6}>
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
            </Grid> */}
              <Grid item xs={6}>
                <Box p={3}>
                  <Button variant='contained' onClick={() => joinGame()}>
                    <Typography variant='h4' component='h1' gutterBottom>
                      join
                    </Typography>
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Item>
        </Box>
      </Container>
    </Layout>
  );
};

export default Mypage;
