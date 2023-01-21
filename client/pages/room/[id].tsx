import { Box, Container } from '@mui/material';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect } from 'react';
// import GameDisplay from '../../component/GameDisplay';
const GameDisplay = dynamic(() => import('../../component/GameDisplay'), {
  ssr: false,
});
const Room = () => {
  const router = useRouter();

  const browserBack = useCallback(() => {
    window.history.go(1);
  }, []);

  const browserReload = useCallback(() => {
    router.push('/');
  }, []);

  useEffect(() => {
    const { id } = router.query;
    console.log('roomID: ', id);
    window.addEventListener('popstate', browserBack);
    window.addEventListener('beforeunload', browserReload);

    return () => {
      window.removeEventListener('popstate', browserBack);
      window.removeEventListener('beforeunload', browserReload);
    };
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
