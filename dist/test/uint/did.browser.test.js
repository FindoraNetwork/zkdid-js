"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const assert_1 = __importDefault(require("assert"));
const did_1 = require("../../src/did");
const tool_1 = require("../../src/lib/tool");
const tool_2 = require("../lib/tool");
(0, mocha_1.describe)('DID', () => {
    (0, mocha_1.describe)('#hasDID()', () => {
        const account = (0, tool_2.getRandomAddress)();
        (0, mocha_1.it)('should return false when the address is not createDID', () => {
            assert_1.default.strictEqual((0, did_1.hasDID)(account), false);
        });
        (0, mocha_1.it)('should return true when the address createDID already', () => {
            (0, did_1.createDID)(account);
            assert_1.default.strictEqual((0, did_1.hasDID)(account), true);
        });
    });
    (0, mocha_1.describe)('#getDID()', () => {
        const account = (0, tool_2.getRandomAddress)();
        (0, mocha_1.it)('should throw error when the address is not createDID', () => {
            assert_1.default.throws(() => (0, did_1.getDID)(account));
        });
        (0, mocha_1.it)('should return did when the address createDID already', () => {
            (0, did_1.createDID)(account);
            const did = (0, did_1.getDID)(account);
            assert_1.default.strictEqual((0, tool_1.isDID)(did), true);
        });
    });
    (0, mocha_1.describe)('#createDID()', () => {
        const account = (0, tool_2.getRandomAddress)();
        (0, mocha_1.it)('should return did when the address first createDID', () => {
            const did = (0, did_1.createDID)(account);
            assert_1.default.strictEqual((0, tool_1.isDID)(did), true);
        });
        (0, mocha_1.it)('should throw error when the address is createDID already', () => {
            assert_1.default.throws(() => (0, did_1.createDID)(account));
        });
    });
});
