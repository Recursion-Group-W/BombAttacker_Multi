export interface Stack<E> {
  peekBack(): E | null; // リストの末尾にある要素を返す
  popBack(): E | null; // リストの末尾の要素を削除し、削除した要素を返す
  pushBack(data: E): void; // リストの末尾に要素を追加
}
