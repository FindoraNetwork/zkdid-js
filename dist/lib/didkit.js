"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let DIDKit;
if (typeof window === "undefined") {
    DIDKit = require('@spruceid/didkit-wasm');
}
else {
    DIDKit = require('@spruceid/didkit-wasm-node');
}
exports.default = DIDKit;
