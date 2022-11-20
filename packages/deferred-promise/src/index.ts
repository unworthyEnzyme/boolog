export default class Deferred<T> implements Promise<T> {
  private resolveCallback?: (value: T | PromiseLike<T>) => void;
  private rejectCallback?: (reason?: any) => any;
  private promise: Promise<T>;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolveCallback = resolve;
      this.rejectCallback = reject;
    });
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?:
      | ((value: T) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null
  ): Promise<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?:
      | ((reason: any) => TResult | PromiseLike<TResult>)
      | undefined
      | null
  ): Promise<T | TResult> {
    return this.promise.then(onrejected);
  }

  resolve(val: T): void {
    this.resolveCallback!(val);
  }

  reject(reason?: any): void {
    this.rejectCallback!(reason);
  }

  [Symbol.toStringTag]: "Promise";
}
