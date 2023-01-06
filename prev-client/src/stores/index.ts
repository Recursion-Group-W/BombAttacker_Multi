import { useGameStore } from './useGameStore';

export const useGameStoreUtil = () => {
  const { gameState } = useGameStore();
  const resetGameState = useGameStore(
    (state) => state.resetGameState
  );
  const setPlayerName = useGameStore(
    (state) => state.setPlayerName
  );
  const setPlayerSpriteKey = useGameStore(
    (state) => state.setPlayerSpriteKey
  );
  const setPlayerStock = useGameStore(
    (state) => state.setPlayerStock
  );
  const setPlayerSpeed = useGameStore(
    (state) => state.setPlayerSpeed
  );
  const setBombPutOnce = useGameStore(
    (state) => state.setBombPutOnce
  );
  const setBombRange = useGameStore(
    (state) => state.setBombRange
  );
  const setBombPower = useGameStore(
    (state) => state.setBombPower
  );
  const setStageType = useGameStore(
    (state) => state.setStageType
  );
  const setStageLevel = useGameStore(
    (state) => state.setStageLevel
  );
  const setKillCount = useGameStore(
    (state) => state.setKillCount
  );

  return {
    gameState,
    resetGameState,
    setPlayerName,
    setPlayerSpriteKey,
    setPlayerStock,
    setPlayerSpeed,
    setBombPutOnce,
    setBombRange,
    setBombPower,
    setStageType,
    setStageLevel,
    setKillCount,
  };
};
