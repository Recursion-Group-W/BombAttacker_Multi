export class Node<E> {
  public prev: Node<E> | null = null;
  public next: Node<E> | null = null;

  constructor(public data: E) {}
}
