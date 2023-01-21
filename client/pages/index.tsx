import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '../src/Link';
import Copyright from '../src/Copyright';
import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider } from '../src/firebase';

export default function Home() {
  const [isAuth, setIsAuth] = React.useState(false);
  const logIn = () => {
    signInWithPopup(auth, provider)
      .then((res) => {
        console.log(res.user);
        console.log(res.user.uid);
        localStorage.setItem('isAuth', 'true');
        setIsAuth(true);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  const logOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
    });
  };
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

        <Box maxWidth='sm' sx={{ py: 2 }}>
          {!isAuth ? (
            <Button onClick={logIn} variant='outlined'>
              <GoogleIcon />
              Login/Signin
            </Button>
          ) : (
            <Button onClick={logOut} variant='outlined'>
              <GoogleIcon />
              Logout
            </Button>
          )}
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
