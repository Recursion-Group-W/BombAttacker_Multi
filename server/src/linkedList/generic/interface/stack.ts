export interface Stack<E> {
  peekBack(): E | null; // リストの末尾にある要素を返します。
  popBack(): E | null; // リストの末尾の要素を削除し、削除した要素を返します。
  pushBack(data: E): void; // リストの末尾に要素を追加します。
}
