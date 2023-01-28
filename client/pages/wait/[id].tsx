import {
  Button,
  Grid,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Slide,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import GoogleIcon from '@mui/icons-material/Google';
import ShareButtons from '../../component/ShareButtons';

import { useRouter } from 'next/router';
import React, { useEffect, useState, FC } from 'react';
import { io } from 'socket.io-client';

import { Layout } from '../../component/Layout';
import { NODE_URL } from '../../env';
import { CustomSocket } from '../../src/socket/interface/customSocket.interface';
import { useSocketStore } from '../../src/store/useSocketStore';
// パス
import { db, signIn } from '../../src/firebase';
import { doc, updateDoc } from 'firebase/firestore';

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

  const [isAuth, setIsAuth] = React.useState(false);
  const [userName, setUserName] = useState('NoName');
  const [standby, setStandby] = useState(false);

  const logIn = async () => {
    await signIn();
    setIsAuth(true);
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
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
  socket.on('roomId', (roomId: string) => {
    router.push(`/room/${roomId}`);
  });
  socket.on('noRoom', () => {
    alert('募集が終了しました。TOPに戻ります。');
    router.push(url);
  });

  const readyToGo = () => {
    if (userName.length === 0) {
      alert('名前を入力してください');
      return;
    }
    setStandby(true);
    socket.emit('guestStandby', id);
  };
  const makeOver = () => {
    socket.emit('makeOver', id);
    setStandby(false);
  };
  const leaveRoom = () => {
    if (confirm('TOPページに戻ります。よろしいですか？')) {
      router.push(url);
    }
  };

  useEffect(() => {
    const { id } = router.query;
    console.log('userID: ', id);
  }, [router.query]);

  return (
    <Layout title='WaitGather'>
      <Dialog
        open
        TransitionComponent={Transition}
        keepMounted
        fullWidth
        aria-describedby='alert-dialog-slide-description'
      >
        <DialogContent>
          <Grid container alignItems='center'>
            <Grid item xs={5}>
              {!isAuth ? (
                <Button
                  fullWidth
                  onClick={logIn}
                  variant='outlined'
                  size='large'
                  disabled={standby}
                >
                  <GoogleIcon />
                  Login/Signin
                </Button>
              ) : (
                <Grid textAlign='center'>ログイン完了</Grid>
              )}
            </Grid>
            <Grid item xs={2} textAlign='center'>
              or
            </Grid>
            <Grid item xs={5}>
              <TextField
                id='filled-basic'
                label='Change Name'
                variant='filled'
                value={userName}
                disabled={standby}
                error={userName!.length > 6}
                required
                fullWidth
                onChange={handleChangeName}
                helperText='6文字以下にしてください'
              />
            </Grid>
          </Grid>
          <DialogContentText id='alert-dialog-slide-description'>
            表示名：{userName}
          </DialogContentText>
          <ShareButtons />
        </DialogContent>
        <DialogActions>
          {!standby ? (
            <Grid container>
              <Grid item xs={4}>
                <Button fullWidth onClick={() => leaveRoom()}>
                  退室する
                </Button>
              </Grid>
              <Grid item xs={8}>
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
            <Button variant='contained' fullWidth onClick={() => makeOver()}>
              戻る
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default WaitGather;
