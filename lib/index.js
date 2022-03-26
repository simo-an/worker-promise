var WorkerPromise = /** @class */ (function () {
    function WorkerPromise() {
        this.param = undefined;
    }
    WorkerPromise.prototype.prepare = function (param) {
        this.param = param;
        return this;
    };
    WorkerPromise.prototype.then = function (fn, param) {
        if (!WorkerPromise.worker)
            this.createWorker();
        WorkerPromise.worker.postMessage({ fn: fn.toString(), param: param || this.param });
        this.param = undefined;
        return new Promise(function (resolve, reject) {
            WorkerPromise.worker.onmessage = function (_a) {
                var data = _a.data;
                return resolve(data);
            };
            WorkerPromise.worker.onerror = reject;
        });
    };
    WorkerPromise.prototype.terminate = function () {
        if (WorkerPromise.worker) {
            WorkerPromise.worker.terminate();
            WorkerPromise.worker = undefined;
        }
    };
    WorkerPromise.prototype.createWorker = function () {
        var workerCode = " \n      self.onmessage = function worker(event) {\n        const {fn, param} = event.data;\n        const func = new Function(\"return \".concat(fn))();\n\n        self.postMessage(func(param));\n      }\n    ";
        var workerUrl = URL.createObjectURL(new Blob([workerCode], { type: 'text/javascript' }));
        WorkerPromise.worker = new Worker(workerUrl);
    };
    return WorkerPromise;
}());
export default WorkerPromise;
