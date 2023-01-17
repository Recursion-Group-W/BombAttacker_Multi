import { Queue } from './queue';
import { Stack } from './stack';

export interface Deque<E> extends Stack<E>, Queue<E> {
  pushFront(data: E): void; // リストの先頭に要素を追加します。
}
