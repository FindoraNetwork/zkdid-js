"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import DIDKitNode from '@spruceid/didkit-wasm-node';
// import DIDKitBrowser from '@spruceid/didkit-wasm';
let wasmLib = '@spruceid/didkit-wasm-node';
if (this === window) {
    require('@spruceid/didkit-wasm');
    wasmLib = '@spruceid/didkit-wasm';
}
const DIDKit = require(wasmLib);
// const DIDKit = global === window ? DIDKitBrowser : DIDKitNode;
// const DIDKit = DIDKitNode;
exports.default = DIDKit;
