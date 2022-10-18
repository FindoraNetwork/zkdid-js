"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomAddress = void 0;
let count = 1;
const getRandomAddress = () => `0x${[Date.now(), ++count, Math.random()].map((v) => v.toString(16)).join('')}`.replace(/0\./, '');
exports.getRandomAddress = getRandomAddress;
