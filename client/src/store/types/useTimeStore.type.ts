export type TimeState = {
  time: number;
};

//usePlayerStoreが持つ状態とメソッドの型
export type TimeStore = {
  timeState: TimeState;
  resetTimeState: () => void;

  updateTimeState: (payload: TimeState) => void;
};
