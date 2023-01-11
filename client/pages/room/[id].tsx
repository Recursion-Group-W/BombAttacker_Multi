import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Screen } from '../../game/model/screen';
import { useSocketStore } from '../../src/store/useSocketStore';

const Room = () => {
  const [nanoSecDiff, setNanoSecDiff] = useState(0);
  const router = useRouter();

  const { socketState } = useSocketStore();
  const socket = socketState.socket;

  //初期状態を取得したいということをサーバーに伝える
  // socket.emit('getInitialState');

  //サーバーからゲームデータを受け取る
  socket.on('syncGame', (res: { nanoSecDiff: number }) => {
    setNanoSecDiff(res.nanoSecDiff);
  });

  useEffect(() => {
    const { id } = router.query;
    console.log('roomID: ', id);
    const canvas: HTMLCanvasElement | null =
      document.querySelector('#game-canvas');
    if (canvas) {
      const screen = new Screen(socket, canvas);
      // キャンバスの描画開始
      screen.animate(0);
    }
  }, [router.query]);
  return (
    <>
      <canvas id='game-canvas'></canvas>
      {/* <p>{(nanoSecDiff * 1e-9).toFixed(9)} [s]</p> */}
    </>
  );
};

export default Room;
