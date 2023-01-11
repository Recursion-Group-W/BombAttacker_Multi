import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Screen } from '../../game/model/screen';
import { useSocketStore } from '../../src/store/useSocketStore';

// キーの入力（キーダウン、キーアップ）の処理
// let objMovement = {};	// 動作
// $( document ).on(
//     'keydown keyup',
//     ( event ) =>
//     {
//         const KeyToCommand = {
//             'ArrowUp': 'forward',
//             'ArrowDown': 'back',
//             'ArrowLeft': 'left',
//             'ArrowRight': 'right',
//         };
//         const command = KeyToCommand[event.key];
//         if( command )
//         {
//             if( event.type === 'keydown' )
//             {
//                 objMovement[command] = true;
//             }
//             else // if( event.type === 'keyup' )
//             {
//                 objMovement[command] = false;
//             }
//             // サーバーに イベント名'change-my-movement'と、objMovementオブジェクトを送信
//             socket.emit( 'change-my-movement', objMovement );
//         }
//     } );

const Room = () => {
  const router = useRouter();

  const { socketState } = useSocketStore();
  const socket = socketState.socket;

  //初期状態を取得したいということをサーバーに伝える
  // socket.emit('getInitialState');

  const objMovement: { [key: string]: boolean } = {
    forward: false,
    back: false,
    right: false,
    left: false,
  };
  const keyDownHandler = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        objMovement['forward'] = true;
        break;
      case 'ArrowDown':
        objMovement['back'] = true;
        break;
      case 'ArrowRight':
        objMovement['right'] = true;
        break;
      case 'ArrowLeft':
        objMovement['left'] = true;
        break;
    }
    console.log(objMovement);
    socket.emit('moveTank', objMovement);

    if (e.code === 'Space') {
      socket.emit('shoot');
    }
  };
  const keyUpHandler = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        objMovement['forward'] = false;
        break;
      case 'ArrowDown':
        objMovement['back'] = false;
        break;
      case 'ArrowRight':
        objMovement['right'] = false;
        break;
      case 'ArrowLeft':
        objMovement['left'] = false;
        break;
    }
    socket.emit('moveTank', objMovement);
  };

  useEffect(() => {
    const { id } = router.query;
    console.log('roomID: ', id);
    const canvas: HTMLCanvasElement | null =
      document.querySelector('#game-canvas');
    if (canvas) {
      const screen = new Screen(socket, canvas);
      // キャンバスの描画開始
      screen.animate(0);

      document.addEventListener(
        'keydown',
        keyDownHandler,
        false
      );
      document.addEventListener(
        'keyup',
        keyUpHandler,
        false
      );
    }
  }, [router.query]);
  return (
    <>
      <canvas id='game-canvas'></canvas>
    </>
  );
};

export default Room;
