import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider, db } from '../src/firebase';
import { useRouter } from 'next/router';
import { Layout } from '../component/Layout';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useEffect, useState, FC } from 'react';

export default function Home() {
  const router = useRouter();

  const [isAuth, setIsAuth] = React.useState(false);
  const [UserName, setUserName] = useState('')

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value)
  }
  
  const handleClick = () => {
    // ログインAPIにPOSTする処理
  }

  function makeUserName(UserName:string, displayName:string | null){
    if (displayName != null){
      if (UserName === "") return displayName.substr(0,4)
      else return UserName
    }
    else return
  }
  const logIn = () => {
    signInWithPopup(auth, provider)
      .then((res) => {
        setDoc(doc(db, "test", res.user.uid), {
          name: makeUserName(UserName, res.user.displayName),
          state: "CA",
          country: "USA",
          uid: res.user.uid,
          BestScore: 0,
        })
        .catch((error) => {
          console.log(error.message);
        })
        console.log(res.user.displayName);
        console.log(res.user.uid);
        localStorage.setItem('userId', res.user.uid);
        localStorage.setItem('isAuth', 'true');
        setIsAuth(true);
        router.push(`/mypage/${res.user.uid}`);
  });
}
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
      >
        <Box sx={{ typography: 'h3', fontWeight: 900 }}>
          表示名
        </Box>
        <input onChange={handleChangeName} defaultValue="NoName" value={UserName} />
        <div>
        <Button 
        variant='outlined'
        size='large'
        onClick={handleClick}>
          決定
          </Button>
        </div>
      </Box>
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
