import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

const Room = () => {
  const router = useRouter();

  //初期状態を取得したいということをサーバーに伝える
    // socket.emit('getInitialState');

    //サーバーからゲームデータを受け取る
    // socket.on('SyncGame', (res: any) => {
    //   console.log(res);
    // });
  useEffect(() => {
    const { id } = router.query;
    console.log('roomID: ', id);
  }, [router.query]);
  return <canvas id='game'></canvas>;
};

export default Room;