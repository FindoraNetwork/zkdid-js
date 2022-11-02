"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let DIDKit;
if (globalThis === window) {
    DIDKit = require('@spruceid/didkit-wasm');
}
else {
    DIDKit = require('@spruceid/didkit-wasm-node');
}
exports.default = DIDKit;
