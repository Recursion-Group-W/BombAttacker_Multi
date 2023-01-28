import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google';
import { signOut } from 'firebase/auth';
import { auth, signIn } from '../src/firebase';
import { useRouter } from 'next/router';
import { Layout } from '../component/Layout';

export default function Home() {
  const router = useRouter();

  const [isAuth, setIsAuth] = React.useState(false);

  const logIn = async () => {
    await signIn();
    router.push(`/mypage/${localStorage.getItem('userId')}`);
    setIsAuth(true);
  };
  const logOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
    });
  };
  
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
            BombAttacker_Multi
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          ></Box>
          <Box maxWidth='sm' sx={{ py: 2 }}>
            {!isAuth ? (
              <Button onClick={logIn} variant='outlined' size='large'>
                <GoogleIcon />
                Login/Signin
              </Button>
            ) : (
              <Button onClick={logOut} variant='outlined' size='large'>
                <GoogleIcon />
                Logout
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    </Layout>
  );
}
