import { Deque } from './interface/deque';
import { GenericAbstractList } from './genericAbstractList';
import { Node } from './node';

export class GenericLinkedList<E>
  extends GenericAbstractList<E>
  implements Deque<E>
{
  private head: Node<E> | null = null;
  private tail: Node<E> | null = null;

  constructor() {
    super();
  }

  // public toString():string{
  //     StringBuilder str = new StringBuilder("[");
  //     let iterator = this.head;
  //     while(iterator != null){
  //         str.append(iterator.data + ", ");
  //         iterator = iterator.next;
  //     }
  //     str.append("]");
  //     return str.toString();
  // }
  public peekFront(): E | null {
    if (this.head == null) return null;
    return this.head.data;
  }
  public popFront(): E | null {
    if (this.head == null) return null;
    let temp = this.head;
    this.head = this.head.next;
    if (this.head != null) this.head.prev = null;
    else this.tail = null;

    return temp.data;
  }
  public pushBack(data: E): void {
    let node = new Node<E>(data);
    if (this.peekBack() == null) {
      this.head = node;
      this.tail = this.head;
    } else {
      node.prev = this.tail;
      if (this.tail) {
        this.tail.next = node;
        this.tail = this.tail.next;
      }
    }
  }
  public peekBack(): E | null {
    if (this.tail == null) return this.peekFront();
    return this.tail.data;
  }
  public popBack(): E | null {
    if (this.tail == null) return null;
    let temp = this.tail;
    this.tail = this.tail.prev;
    if (this.tail != null) this.tail.next = null;
    else this.head = null;

    return temp.data;
  }
  public pushFront(data: E): void {
    let node = new Node<E>(data);
    if (this.peekFront() == null) {
      this.head = node;
      this.tail = this.head;
    } else {
      node.next = this.head;
      if (this.head) {
        this.head.prev = node;
        this.head = this.head.prev;
      }
    }
  }
  public at(index: number): Node<E> | null {
    if (index < 0) return null;
    let iterator = this.head;
    let i = 0;
    while (iterator && i < index) {
      iterator = iterator.next;
      if (iterator === null) return null;
      i++;
    }
    return iterator;
  }
  public size(): number {
    if (this.head == null) return 0;
    let size = 0;
    let iterator: Node<E> | null = this.head;
    while (iterator != null) {
      size++;
      iterator = iterator.next;
    }
    return size;
  }
  public get(index: number): E | null {
    let found = this.at(index);
    if (found == null) return null;
    return found.data;
  }
  public add(element: E): void {
    this.pushBack(element);
  }
  public pop(): E | null {
    return this.popBack();
  }
  public addAt(index: number, element: E): void {
    if (index < 0) return;
    if (index == this.size()) {
      this.pushBack(element);
      return;
    }
    let targetNode = this.at(index);
    if (targetNode == this.head) {
      this.pushFront(element);
      return;
    }
    let node = new Node<E>(element);
    if (targetNode) {
      node.prev = targetNode.prev;
      node.next = targetNode;
      if (node.prev) {
        node.prev.next = node;
        targetNode.prev = node;
      }
    }
  }
  public remove(deleteNode: Node<E>): E | null {
    if (deleteNode === null) return null;
    if (deleteNode === this.head) this.popFront();
    else if (deleteNode === this.tail) this.popBack();
    else {
      if (deleteNode.prev) {
        deleteNode.prev.next = deleteNode.next;
      }
      if (deleteNode.next) {
        deleteNode.next.prev = deleteNode.prev;
      }
    }
    return deleteNode.data;
  }

  public removeAt(index: number): E | null {
    let deleteNode = this.at(index);
    if (deleteNode == null) return null;
    if (deleteNode == this.head) this.popFront();
    else if (deleteNode == this.tail) this.popBack();
    else {
      if (deleteNode.prev) {
        deleteNode.prev.next = deleteNode.next;
      }
      if (deleteNode.next) {
        deleteNode.next.prev = deleteNode.prev;
      }
    }
    return deleteNode.data;
  }
  public removeAllAt(start: number, end: number): void {
    let startNode = this.at(start);
    let endNode = this.at(end);
    if (startNode == null) return;
    else if (endNode == null) {
      this.tail = startNode.prev;
      if (this.tail != null) this.tail.next = null;
      else this.head = null;
    } else {
      if (startNode.prev) startNode.prev.next = endNode;
      endNode.prev = startNode.prev;
    }
  }
  public subList(
    start: number,
    end: number
  ): GenericAbstractList<E> {
    let iterator = this.at(start);
    let endNode = this.at(end);
    let deepCopy = new GenericLinkedList<E>();
    while (iterator != null && iterator != endNode) {
      deepCopy.pushBack(iterator.data);
      iterator = iterator.next;
    }
    return deepCopy;
  }
}
