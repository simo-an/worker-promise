export class WorkerPromise {
  private static worker: Worker
  private param = undefined
  private refs: Array<{ name: string, fn: string }> = []

  constructor() { }

  public provide(param: any, refs?: Function[]): WorkerPromise {
    if (Array.isArray(param) && typeof param[0] === 'function') {
      refs = param
    } else {
      this.param = param;
      refs = refs || []
    }

    this.refs = refs.map(ref => ({ name: ref.name, fn: ref.toString() }))

    return this;
  }

  public then(fn: Function, param?: any, refs?: Function[]): Promise<any> {
    if (!WorkerPromise.worker) this.createWorker();
    if (param || refs) this.provide(param, refs)

    WorkerPromise.worker.postMessage({
      fn: fn.toString(),
      param: this.param,
      refs: this.refs
    });

    this.param = undefined;
    this.refs.length = 0;

    return new Promise((resolve, reject) => {
      WorkerPromise.worker.onmessage = ({ data }) => resolve(data);
      WorkerPromise.worker.onerror = reject;
    });
  }

  public terminate(): void {
    if (WorkerPromise.worker) {
      WorkerPromise.worker.terminate();
      WorkerPromise.worker = undefined;
    }
  }

  private createWorker(): void {
    const workerCode = ` 
      const toFunction = (fn) => new Function("return ".concat(fn))();

      self.onmessage = function worker(event) {
        let {fn, param, refs} = event.data;

        refs.forEach(ref => self[ref.name] = toFunction(ref.fn))
        self.postMessage(toFunction(fn).call(self, param));
        refs.forEach(ref => (delete self[ref.name]))
      }
    `;
    const workerUrl = URL.createObjectURL(new Blob([workerCode], { type: 'text/javascript' }));

    WorkerPromise.worker = new Worker(workerUrl);
  }
}
