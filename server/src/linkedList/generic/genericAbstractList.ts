
export abstract class GenericAbstractList<E>
  
{
  private initialList: E[] = [];

  constructor() {}

  //   constructor(arr: E[]) {
  //     this.initialList = arr;
  //   }

  public getOriginalList(): E[] {
    return this.initialList;
  }

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
