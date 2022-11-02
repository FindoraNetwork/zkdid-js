"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let DIDKit;
if (this === window) {
    DIDKit = require('@spruceid/didkit-wasm');
}
else {
    let wasmLib = '@spruceid/didkit-wasm-node';
    DIDKit = require(wasmLib);
}
exports.default = DIDKit;
