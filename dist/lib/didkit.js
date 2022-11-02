"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import DIDKitNode from '@spruceid/didkit-wasm-node';
// import DIDKitBrowser from '@spruceid/didkit-wasm';
const wasmLib = this === window ? '@spruceid/didkit-wasm' : '@spruceid/didkit-wasm-node';
const DIDKit = require(wasmLib);
// const DIDKit = global === window ? DIDKitBrowser : DIDKitNode;
// const DIDKit = DIDKitNode;
exports.default = DIDKit;
