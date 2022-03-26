class WorkerPromise {
  private static worker: Worker
  private param = undefined

  constructor() { }

  public prepare(param: any) {
    this.param = param

    return this
  }

  public then(fn: object, param?: any) {
    if (!WorkerPromise.worker) this.createWorker()

    WorkerPromise.worker.postMessage({ fn: fn.toString(), param: param || this.param })

    this.param = undefined

    return new Promise((resolve, reject) => {
      WorkerPromise.worker.onmessage = ({ data }) => resolve(data);
      WorkerPromise.worker.onerror = reject
    })
  }

  public terminate() {
    if (WorkerPromise.worker) {
      WorkerPromise.worker.terminate()
      WorkerPromise.worker = undefined
    }
  }

  private createWorker(): void {
    const workerCode = ` 
      self.onmessage = function worker(event) {
        const {fn, param} = event.data;
        const func = new Function("return ".concat(fn))();

        self.postMessage(func(param));
      }
    `
    const workerUrl = URL.createObjectURL(new Blob([workerCode], { type: 'text/javascript' }))
    WorkerPromise.worker = new Worker(workerUrl)
  }
}

export default WorkerPromise
