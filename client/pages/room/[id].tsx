import { Box, Container } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import GameDisplay from '../../component/GameDisplay';

const Room = () => {
  const router = useRouter();

  useEffect(() => {
    const { id } = router.query;
    console.log('roomID: ', id);
  }, [router.query]);
  return (
    <>
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
          <GameDisplay />
        </Box>
      </Container>
    </>
  );
};

export default Room;
