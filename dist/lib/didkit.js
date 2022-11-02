"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let DIDKit;
if (this === window) {
    DIDKit = require('@spruceid/didkit-wasm');
}
else {
    const requireTemp = require;
    DIDKit = requireTemp('@spruceid/didkit-wasm-node');
}
exports.default = DIDKit;
