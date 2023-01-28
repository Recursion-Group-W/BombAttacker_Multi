import { Grid } from '@mui/material';
import React from 'react';
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
} from 'react-share';
import { NODE_URL } from '../env';

const ShareButtons = () => {
  const title = 'BombAttackerでマルチ対戦の相手を探しています。';
  const url = NODE_URL + '/' + localStorage.getItem('userId');
  return (
    <Grid container justifyContent='center'>
      <Grid item px={2}>
        <TwitterShareButton
          url={url}
          title={title}
          hashtags={['BombAttacker', 'multi_play']}
        >
          <TwitterIcon size={32} round />
        </TwitterShareButton>
      </Grid>
      <Grid item px={2}>
        <FacebookShareButton url={url} quote={title}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
      </Grid>
    </Grid>
  );
};

export default ShareButtons;
