"use strict";
exports.__esModule = true;
var lib_1 = require("../lib");
var printName = function () { return console.warn('SIMU'); };
var printAge = function () { return console.warn('27'); };
var wp = new lib_1["default"]();
wp.then(function () {
    printName();
    printAge();
    console.warn('This block\'s code is running at worker thread!');
    return "Name: SIMU, Age: 27";
}).then(function (authorInfo) { return console.warn(authorInfo); });
console.warn('This block\'s code is running at main thread!');
