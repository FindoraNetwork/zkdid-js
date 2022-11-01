"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const didkit_wasm_node_1 = __importDefault(require("@spruceid/didkit-wasm-node"));
// import DIDKitBrowser from '@spruceid/didkit-wasm';
// const DIDKit = this === window ? DIDKitBrowser : DIDKitNode;
const DIDKit = didkit_wasm_node_1.default;
exports.default = DIDKit;
