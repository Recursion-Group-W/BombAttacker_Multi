import { useSocketStore } from '../src/store/useSocketStore';
import styles from '../styles/GameDisplay.module.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { Box } from '@mui/system';
import { PreloadScene } from '../src/game/scene/PreloadScene';
import { MainScene } from '../src/game/scene/MainScene';
import { Screen } from '../src/game/model/screen';

const GameDisplay = () => {
  const { socketState } = useSocketStore();
  const socket = socketState.socket;

  const [game, setGame] = useState<Phaser.Game>();

  //Phaserの初期設定を行うメソッド
  const initPhaser = async () => {
    //描画設定
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      scale: {
        parent: 'phaser-game',
        width: 1160,
        height: 1160,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false,
        },
      },

      pixelArt: true,
      scene: [PreloadScene, MainScene],
      backgroundColor: '#a9a9a9',
      callbacks: {
        preBoot: (game) => {
          // PhaserGameの中からZustandの状態にアクセスできるように登録
          game.registry.set('socket', socket);
        },
      },
    };
    const phaserGame = new Phaser.Game(config);

    setGame(phaserGame);
  };

  useEffect(() => {
    initPhaser();
  }, []);
  //初期状態を取得したいということをサーバーに伝える
  // socket.emit('getInitialState');

  const playerMovement: { [key: string]: boolean } = {
    up: false,
    right: false,
    down: false,
    left: false,
  };

  const objMovement: { [key: string]: boolean } = {
    forward: false,
    back: false,
    right: false,
    left: false,
  };
  const keyDownHandler = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        playerMovement.up = true;
        objMovement['forward'] = true;
        break;
      case 'ArrowDown':
        playerMovement.down = true;
        objMovement['back'] = true;
        break;
      case 'ArrowRight':
        playerMovement.right = true;
        objMovement['right'] = true;
        break;
      case 'ArrowLeft':
        playerMovement.left = true;
        objMovement['left'] = true;
        break;
    }
    console.log('playerMovement: ', playerMovement);
    console.log(objMovement);
    socket.emit('movePlayer', playerMovement);
    socket.emit('moveTank', objMovement);

    if (e.code === 'Space') {
      socket.emit('shoot');
    }
  };
  const keyUpHandler = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        playerMovement.up = false;
        objMovement['forward'] = false;
        break;
      case 'ArrowDown':
        playerMovement.down = false;
        objMovement['back'] = false;
        break;
      case 'ArrowRight':
        playerMovement.right = false;
        objMovement['right'] = false;
        break;
      case 'ArrowLeft':
        playerMovement.left = false;
        objMovement['left'] = false;
        break;
    }
    socket.emit('movePlayer', objMovement);
    socket.emit('moveTank', objMovement);
  };

  useEffect(() => {
    const canvas: HTMLCanvasElement | null =
      document.querySelector('#game-canvas');
    if (canvas) {
      // const screen = new Screen(socket, canvas);
      // // キャンバスの描画開始
      // screen.animate(0);

    }
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
  }, []);
  return (
    <>
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* <canvas
          id='game-canvas'
          className={styles.canvasBorder}
        ></canvas> */}
        <div
          id='phaser-game'
          className={styles.canvasBorder}
        ></div>
      </Box>
    </>
  );
};

export default GameDisplay;
