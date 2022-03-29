var WorkerPromise = /** @class */ (function () {
    function WorkerPromise() {
        this.param = undefined;
        this.refs = [];
    }
    WorkerPromise.prototype.provide = function (param, refs) {
        if (Array.isArray(param) && typeof param[0] === 'function') {
            refs = param;
        }
        else {
            this.param = param;
            refs = refs || [];
        }
        this.refs = refs.map(function (ref) { return ({ name: ref.name, fn: ref.toString() }); });
        return this;
    };
    WorkerPromise.prototype.then = function (fn, param, refs) {
        if (!WorkerPromise.worker)
            this.createWorker();
        if (param || refs)
            this.provide(param, refs);
        WorkerPromise.worker.postMessage({
            fn: fn.toString(),
            param: this.param,
            refs: this.refs
        });
        this.param = undefined;
        this.refs.length = 0;
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
        var workerCode = " \n      const toFunction = (fn) => new Function(\"return \".concat(fn))();\n\n      self.onmessage = function worker(event) {\n        let {fn, param, refs} = event.data;\n\n        refs.forEach(ref => self[ref.name] = toFunction(ref.fn))\n        self.postMessage(toFunction(fn).call(self, param));\n        refs.forEach(ref => (delete self[ref.name]))\n      }\n    ";
        var workerUrl = URL.createObjectURL(new Blob([workerCode], { type: 'text/javascript' }));
        WorkerPromise.worker = new Worker(workerUrl);
    };
    return WorkerPromise;
}());
export { WorkerPromise };
