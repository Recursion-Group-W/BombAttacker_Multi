import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '../Link';
import ProTip from '../ProTip';
import Copyright from '../Copyright';

export default function Home() {
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
          MUI v5 + Next.js with TypeScript example
        </Typography>
        <Link href='/about' color='secondary'>
          Go to the about page
        </Link>
        <Link
          href='/play'
          style={{ textDecoration: 'none' }}
        >
          <h1>Game Start!!</h1>
        </Link>
        <a href="https://jp.freepik.com/free-vector/explosion-process-set-with-explosion-stages-symbols-cartoon-vector-illustration_4431352.htm#query=sprite%20animation%20explode&position=8&from_view=search&track=ais">著作者：macrovector_official</a>／出典：Freepik
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
}
