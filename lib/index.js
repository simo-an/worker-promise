var workerCode = " \n  self.onmessage = function worker(event) {\n    const fn = event.data;\n    const func = new Function(\"return \".concat(fn))();\n\n    self.postMessage(func());\n  }\n";
var workerUrl = URL.createObjectURL(new Blob([workerCode], { type: 'text/javascript' }));
var webWorker = new Worker(workerUrl);
var WorkerPromise = /** @class */ (function () {
    function WorkerPromise() {
    }
    WorkerPromise.prototype.then = function (fn) {
        webWorker.postMessage(fn.toString());
        return new Promise(function (resolve, reject) {
            webWorker.onmessage = function (_a) {
                var data = _a.data;
                return resolve(data);
            };
            webWorker.onerror = reject;
        });
    };
    return WorkerPromise;
}());
export default WorkerPromise;
