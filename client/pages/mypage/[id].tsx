import { Box, Button, Grid, Paper, styled, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import React, { useEffect, useState, FC, ChangeEvent } from 'react';
import { io } from 'socket.io-client';

import { Layout } from '../../component/Layout';
import { NODE_URL } from '../../env';
import Copyright from '../../src/Copyright';
import { CustomSocket } from '../../src/socket/interface/customSocket.interface';
import { useSocketStore } from '../../src/store/useSocketStore';
import Link from '../../src/Link';
// パス
import { db } from '../../src/firebase';
import { doc, updateDoc } from "firebase/firestore";


import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

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

const Mypage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [UserName, setUserName] = useState('');


  
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value)
  }

  const handleClick = () => {
    const uid = localStorage.getItem("userId")!.toString()
    updateDoc(doc(db, "users", uid), {
      name:UserName != "" ? UserName : "NoName"
    })
    .catch((error) => {
      console.log(error.message);
    })
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

  const [loading, setLoading] = useState(true);

  return (
    <Layout title='Mypage'>
      <Box
        // height='20vh'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          // justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant='h4' component='h1' gutterBottom>
          表示名
        </Typography>
        <input onChange={handleChangeName} value={UserName} placeholder="NoName"/>
        <div>
          <Button color='success' variant='contained' onClick={handleClick}>
            決定
          </Button>
        </div>
      </Box>
      <Box
        height='100vh'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Grid container spacing={1}>
          <Grid
            container
            direction='column'
            item
            xs={4}
            spacing={12}
            justifyContent='center'
            alignItems='center'
          >
            <Grid item xs></Grid>
          </Grid>
          <Grid
            container
            direction='column'
            item
            xs={4}
            spacing={12}
            justifyContent='center'
            alignItems='center'
          >
            <Grid item xs={4}>
              <Item>
                <Box maxWidth='sm'>
                  <Button
                    variant='contained'
                    color='success'
                    size='large'
                    onClick={handleClickOpen}
                  >
                    <Typography variant='h4' component='h1' gutterBottom>
                      ロビーを作る
                    </Typography>
                  </Button>
                </Box>
              </Item>
            </Grid>
            <Grid item xs={4}>
              <Item>
                <Box maxWidth='sm'>
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
            <Grid item xs={4}>
              <Item>
                <Box maxWidth='sm'>
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

            <Dialog
              open={open}
              TransitionComponent={Transition}
              keepMounted
              aria-describedby='alert-dialog-slide-description'
            >
              <DialogTitle>{"Use Google's location service?"}</DialogTitle>
              <DialogContent>
                <DialogContentText id='alert-dialog-slide-description'>
                  text
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Disconnected</Button>
                <Button variant='contained' onClick={() => joinRoom()}>
                  Start
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
          <Grid
            container
            direction='column'
            item
            xs={4}
            spacing={12}
            justifyContent='center'
            alignItems='center'
          >
            <Grid item xs></Grid>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default Mypage;
