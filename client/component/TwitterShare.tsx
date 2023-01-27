import React from 'react';
import { TwitterShareButton } from 'react-share';
import TwitterIcon from 'react-share/lib/TwitterIcon';

const TwitterShare = () => {
  return (
    <TwitterShareButton
      url={'http://localhost:3000/wait/' + localStorage.getItem('userId')}
      title={'BombAttackerでマルチ対戦の相手を探しています。'}
      hashtags={['BombAttacker', 'multi_play']}
    >
      <TwitterIcon size={32} round />
    </TwitterShareButton>
  );
};

export default TwitterShare;
