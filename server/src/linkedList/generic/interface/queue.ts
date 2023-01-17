export interface Queue<E> {
  peekFront(): E | null; // リストの先頭にある要素を返す
  popFront(): E | null; // リストの先頭の要素を削除し、削除した要素を返す
  pushBack(data: E): void; // リストの末尾に要素を追加
}
