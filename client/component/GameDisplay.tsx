import styles from '../styles/GameDisplay.module.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { Box } from '@mui/system';
import { usePhaserConfig } from '../src/game/config/usePhaserConfig';
import StateDisplay from './StateDisplay';
import { useItemStore } from '../src/store/useItemStore';
import { useTimeStore } from '../src/store/useTimeStore';

const GameDisplay = () => {
  const [game, setGame] = useState<Phaser.Game>();

  const updateTimeState = useTimeStore((state) => state.updateTimeState);

  //Phaserの設定
  const { config } = usePhaserConfig();

  //PhaserのGameを作成するメソッド
  const startPhaser = async () => {
    const phaserGame = new Phaser.Game(config);

    phaserGame.events.on('updateTimeState', updateTimeState);

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
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <StateDisplay />

        <div id='phaser-game' className={styles.canvasBorder}></div>
      </Box>
    </>
  );
};

export default GameDisplay;
