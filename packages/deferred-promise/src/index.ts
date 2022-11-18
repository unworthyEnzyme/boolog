export default class Deferred<T> {
  private promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  then(
    onfulfilled?: ((value: unknown) => unknown) | null | undefined,
    onrejected?: ((reason: any) => PromiseLike<never>) | null | undefined
  ): Promise<unknown> {
    return this.promise.then(onfulfilled, onrejected);
  }

  catch(
    onrejected?: ((reason: any) => PromiseLike<never>) | null | undefined
  ): Promise<unknown> {
    return this.promise.catch(onrejected);
  }
}
