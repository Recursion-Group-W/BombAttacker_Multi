import { Box, Button, Grid, Paper, styled, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState, FC, ChangeEvent } from 'react';
import { Layout } from '../../component/Layout';
import Link from '../../src/Link';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  //   padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Mypage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [UserName, setUserName] = useState('');

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };

  const handleClick = () => {
    // ログインAPIにPOSTする処理
  };
  return (
    <Layout title='Mypage'>
      <Box
        // height='20vh'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          // justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant='h4' component='h1' gutterBottom>
          表示名
        </Typography>
        <input onChange={handleChangeName} value={UserName} />
        <div>
          <Button color='success' variant='contained' onClick={handleClick}>
            決定
          </Button>
        </div>
      </Box>
      <Box
        height='100vh'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Grid container spacing={1}>
          <Grid
            container
            direction='column'
            item
            xs={4}
            spacing={12}
            justifyContent='center'
            alignItems='center'
          >
            <Grid item xs></Grid>
          </Grid>
          <Grid
            container
            direction='column'
            item
            xs={4}
            spacing={12}
            justifyContent='center'
            alignItems='center'
          >
            <Grid item xs></Grid>
          </Grid>
          <Grid
            container
            direction='column'
            item
            xs={4}
            spacing={12}
            justifyContent='center'
            alignItems='center'
          >
            <Grid item xs={4}>
              <Item>
                <Box maxWidth='sm'>
                  <Button
                    variant='contained'
                    component={Link}
                    noLinkStyle
                    color='success'
                    size='large'
                    href={`/lobby/${id}`}
                  >
                    <Typography variant='h4' component='h1' gutterBottom>
                      ロビー
                    </Typography>
                  </Button>
                </Box>
              </Item>
            </Grid>
            <Grid item xs={4}>
              <Item>
                <Box maxWidth='sm'>
                  <Button
                    variant='contained'
                    component={Link}
                    noLinkStyle
                    color='success'
                    size='large'
                    href={`/score/${id}`}
                  >
                    <Typography variant='h4' component='h1' gutterBottom>
                      スコア
                    </Typography>
                  </Button>
                </Box>
              </Item>
            </Grid>
            <Grid item xs={4}>
              <Item>
                <Box maxWidth='sm'>
                  <Button
                    variant='contained'
                    component={Link}
                    noLinkStyle
                    color='success'
                    size='large'
                    href={`/ranking`}
                  >
                    <Typography variant='h4' component='h1' gutterBottom>
                      ランキング
                    </Typography>
                  </Button>
                </Box>
              </Item>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default Mypage;
