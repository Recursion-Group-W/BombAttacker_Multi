import { Box } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import { useItemStore } from '../src/store/useItemStore';
import { useSocketStore } from '../src/store/useSocketStore';
import { useTimeStore } from '../src/store/useTimeStore';

const StateDisplay = () => {
  const { itemState } = useItemStore();
  const updateItemState = useItemStore((state) => state.updateItemState);

  const { timeState } = useTimeStore();
  const resetTimeState = useTimeStore((state) => state.resetTimeState);

  const { socketState } = useSocketStore();
  const socket = socketState.socket;

  socket?.on('disconnect', () => {
    resetTimeState();
  });

  socket?.on(
    'itemState',
    (res: {
      items: {
        bombUp: number;
        fireUp: number;
        speedUp: number;
      };
    }) => {
      updateItemState(res.items);
    }
  );

  return (
    <>
      <Box
        height={50}
        sx={{
          my: 1,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box
          height={50}
          width={150}
          sx={{
            my: 1,
            display: 'flex',
            flexDirection: 'row',
            // justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box sx={{ typography: 'h6', fontWeight: 500 }}>
            time: {Math.floor(timeState.time)}
          </Box>
        </Box>
        <Box
          height={50}
          width={450}
          sx={{
            my: 1,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              my: 1,
              display: 'flex',
              flexDirection: 'row',
              // justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              src='/assets/bean_blue.png'
              alt=''
              width={30}
              height={30}
            ></Image>{' '}
            <Box sx={{ typography: 'h6', fontWeight: 500 }}>
              {itemState.bombUp}
            </Box>
          </Box>
          <Box
            sx={{
              my: 1,
              display: 'flex',
              flexDirection: 'row',
              // justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              src='/assets/bean_orange.png'
              alt=''
              width={30}
              height={30}
            ></Image>{' '}
            <Box sx={{ typography: 'h6', fontWeight: 500 }}>
              {itemState.fireUp}
            </Box>
          </Box>
          <Box
            sx={{
              my: 1,
              display: 'flex',
              flexDirection: 'row',
              // justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              src='/assets/bean_yellow.png'
              alt=''
              width={30}
              height={30}
            ></Image>{' '}
            <Box sx={{ typography: 'h6', fontWeight: 500 }}>
              {itemState.speedUp}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default StateDisplay;
