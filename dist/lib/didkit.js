"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let DIDKit;
if (typeof window === "undefined") {
    DIDKit = require('@spruceid/didkit-wasm-node');
}
else {
    DIDKit = require('@spruceid/didkit-wasm');
}
exports.default = DIDKit;
