import styles from '../styles/GameDisplay.module.css';
import { usePhaserConfig } from '../src/game/config/usePhaserConfig';
import StateDisplay from './StateDisplay';
import { useTimeStore } from '../src/store/useTimeStore';
import { useSocketStore } from '../src/store/useSocketStore';
import { useRouter } from 'next/router';
import React, { useEffect, useState, FC, ChangeEvent } from 'react';
import { TransitionProps } from '@mui/material/transitions';

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from '@mui/material';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />;
});

const GameDisplay = () => {
  const [game, setGame] = useState<Phaser.Game>();
  const [open, setOpen] = React.useState(false);

  const updateTimeState = useTimeStore((state) => state.updateTimeState);

  //Phaserの設定
  const { config } = usePhaserConfig();

  //PhaserのGameを作成するメソッド
  const startPhaser = async () => {
    const phaserGame = new Phaser.Game(config);

    phaserGame.events.on('updateTimeState', updateTimeState);

    setGame(phaserGame);
  };

  const { socketState } = useSocketStore();
  const socket = socketState.socket;

  const router = useRouter();
  useEffect(() => {
    startPhaser();
  }, []);

  socket?.on('reduceLife', (life: number) => {
    console.log('reduceLife');
    if (life == 0) {
      setOpen(true);
    }
  });

  const returnMyPage = () => {
    router.push(`/mypage/${localStorage.getItem('userId')}`);
    setOpen(false);
    socket?.emit('leaveRoom');
  };
  useEffect(() => {}, []);
  return (
    <>
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <StateDisplay />

        <div id='phaser-game' className={styles.canvasBorder}></div>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          fullWidth
          aria-describedby='alert-dialog-slide-description'
        >
          <DialogTitle>{'Waiting...'}</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-slide-description'></DialogContentText>
            <DialogContentText id='alert-dialog-slide-description'></DialogContentText>
            <DialogContentText id='alert-dialog-slide-description'></DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={returnMyPage}>Disconnected</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default GameDisplay;
