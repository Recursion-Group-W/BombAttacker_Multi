import styles from '../styles/GameDisplay.module.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { Box } from '@mui/system';
import { usePhaserConfig } from '../src/game/config/usePhaserConfig';

const GameDisplay = () => {
  const [game, setGame] = useState<Phaser.Game>();

  //Phaserの設定
  const { config } = usePhaserConfig();

  //PhaserのGameを作成するメソッド
  const startPhaser = async () => {
    const phaserGame = new Phaser.Game(config);

    setGame(phaserGame);
  };

  useEffect(() => {
    startPhaser();
  }, []);

  useEffect(() => {}, []);
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
        <div id='phaser-game' className={styles.canvasBorder}></div>
      </Box>
    </>
  );
};

export default GameDisplay;
