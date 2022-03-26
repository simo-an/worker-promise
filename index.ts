const workerCode = ` 
  self.onmessage = function worker(event) {
    const fn = event.data;
    const func = new Function("return ".concat(fn))();

    self.postMessage(func());
  }
`
const workerUrl = URL.createObjectURL(new Blob([workerCode], { type: 'text/javascript' }))
const webWorker = new Worker(workerUrl)

class WorkerPromise {
  constructor() { }
  then(fn: object) {
    webWorker.postMessage(fn.toString())
    return new Promise((resolve, reject) => {
      webWorker.onmessage = ({ data }) => resolve(data);
      webWorker.onerror = reject
    })
  }
}

export default WorkerPromise
