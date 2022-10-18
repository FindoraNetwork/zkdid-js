"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringKeccak256 = exports.isDID = exports.callApi = exports.sleep = void 0;
const solidity_1 = require("@ethersproject/solidity");
const sleep = (s = 200) => new Promise((r) => setTimeout(r, s));
exports.sleep = sleep;
const callApi = (min = 2000, max = 5000) => (0, exports.sleep)(Math.random() * (max - min) + min);
exports.callApi = callApi;
const isDID = (did) => {
    if (!did)
        return false;
    if (typeof did !== 'object')
        return false;
    if (!('id' in did))
        return false;
    if (typeof did.id !== 'string')
        return false;
    if (!did.id)
        return false;
    return true;
};
exports.isDID = isDID;
const stringKeccak256 = (str) => (0, solidity_1.keccak256)(['string'], [str]);
exports.stringKeccak256 = stringKeccak256;
