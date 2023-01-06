import React, { useEffect } from 'react';
import { createGame } from '../game/createGame';

const GameDisplay = () => {
  useEffect(() => {
    createGame();
  }, []);
  return <div>GameDisplay</div>;
};

export default GameDisplay;
