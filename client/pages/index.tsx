import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '../src/Link';
import Copyright from '../src/Copyright';
import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google';

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
          BombAttacker_Multi
        </Typography>

        <Box maxWidth='sm'>
          <Button
            variant='contained'
            component={Link}
            noLinkStyle
            href={`/lobby/${1}`}
          >
            <GoogleIcon />Login/Signin
          </Button>
        </Box>
        <Box maxWidth='sm'>
          <Button
            variant='contained'
            component={Link}
            noLinkStyle
            href={`/lobby/${1}`}
          >
            Go to the Lobby
          </Button>
        </Box>
        <Copyright />
      </Box>
    </Container>
  );
}
