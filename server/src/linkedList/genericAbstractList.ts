
export abstract class GenericAbstractList<E>
  
{
  private initialList: E[] = [];

  // 汎用的なリストを使ってAbstractListを開始することも、空のリストを使って開始することもできます。
  constructor() {}

  //   constructor(arr: E[]) {
  //     this.initialList = arr;
  //   }

  public getOriginalList(): E[] {
    return this.initialList;
  }

  // GenericAbstractListが実装しなければならないメソッド
  public abstract get(index: number): E | null;
  public abstract add(element: E): void;
  public abstract pop(): E | null;
  public abstract addAt(index: number, element: E): void;
  public abstract removeAt(index: number): E | null;
  public abstract removeAllAt(
    start: number,
    end: number
  ): void;
  
  public abstract subList(
    start: number,
    end: number
  ): GenericAbstractList<E>;
}
