export type ScoreState = {
  attackPlayer: number;
  attackNpc: number;
};

//usePlayerStoreが持つ状態とメソッドの型
export type ScoreStore = {
  scoreState: ScoreState;
  resetScoreState: () => void;

  updateScoreState: (payload: ScoreState) => void;
};
