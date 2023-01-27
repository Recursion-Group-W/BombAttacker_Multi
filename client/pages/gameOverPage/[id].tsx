import { Box, Button, Grid, Paper, styled, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import Container from '@mui/material/Container';

import React, { useEffect, useState, FC } from 'react';
import { io } from 'socket.io-client';

import { Layout } from '../../component/Layout';
import { NODE_URL } from '../../env';
import Copyright from '../../src/Copyright';
import { CustomSocket } from '../../src/socket/interface/customSocket.interface';
import { useSocketStore } from '../../src/store/useSocketStore';
import Link from '../../src/Link';
import  { collection, query, where, getDocs, getFirestore } from "firebase/firestore";

// import { db } from '../../../../client/src/firebase';
import { doc, updateDoc } from "firebase/firestore";
import { update } from 'ramda';

const gameOverPage = () => {
  return (
    <Layout title='Title'>
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
          <Box sx={{ typography: 'h1', fontWeight: 900 }}>
            GameOver
          </Box>
          {/* <Box sx={{ typography: 'h1', fontWeight: 900 }}>
            name's score is score;
          </Box> */}
          <Box
          sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
      </Box>
        </Box>
      </Container>
    </Layout>
  );
}

export default gameOverPage;