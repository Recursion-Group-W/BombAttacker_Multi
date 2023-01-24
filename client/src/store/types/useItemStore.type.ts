export type ItemState = {
  fireUp: number;
  bombUp: number;
  speedUp: number;
};

//usePlayerStoreが持つ状態とメソッドの型
export type ItemStore = {
  itemState: ItemState;
  resetItemState: () => void;

  updateItemState: (payload: ItemState) => void;
};
