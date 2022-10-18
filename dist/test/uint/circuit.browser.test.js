"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const assert_1 = __importDefault(require("assert"));
const tool_1 = require("../../src/lib/tool");
const circuit_1 = require("../../src/circuit");
const constants_1 = __importDefault(require("../../src/lib/constants"));
(0, mocha_1.describe)('Circuit', () => {
    const UNKNOW_CIRCUIT_FAMILY = (0, tool_1.stringKeccak256)('UNKNOW_CIRCUIT_FAMILY');
    const UNKNOW_CIRCUIT = new circuit_1.ZKCircuit(12345);
    const PRE_DEFINED_CIRCUIT30 = new circuit_1.ZKCircuit(3.0);
    const PRE_DEFINED_CIRCUIT35 = new circuit_1.ZKCircuit(3.5);
    const PRE_DEFINED_CIRCUI95000 = new circuit_1.ZKCircuit(95000);
    (0, mocha_1.describe)('#hasCircuit()', () => {
        (0, mocha_1.it)('should return false when the circuit family unknow and code unknow', () => {
            assert_1.default.strictEqual((0, circuit_1.hasCircuit)(UNKNOW_CIRCUIT_FAMILY, UNKNOW_CIRCUIT.toCode()), false);
        });
        (0, mocha_1.it)('should return false when the circuit family unknow', () => {
            assert_1.default.strictEqual((0, circuit_1.hasCircuit)(UNKNOW_CIRCUIT_FAMILY, PRE_DEFINED_CIRCUIT30.toCode()), false);
        });
        (0, mocha_1.it)('should return false when the circuit code unknow', () => {
            assert_1.default.strictEqual((0, circuit_1.hasCircuit)(constants_1.default.CIRCUIT_FAMILY, UNKNOW_CIRCUIT.toCode()), false);
        });
        (0, mocha_1.it)('should return true when the circuit family and code match', () => {
            constants_1.default.CIRCUIT_DEFINED.forEach((target) => {
                const circuit = new circuit_1.ZKCircuit(target);
                assert_1.default.strictEqual((0, circuit_1.hasCircuit)(constants_1.default.CIRCUIT_FAMILY, circuit.toCode()), true);
            });
        });
    });
    (0, mocha_1.describe)('#getCircuit()', () => {
        (0, mocha_1.it)('should throw error when the circuit family unknow and code unknow', () => {
            assert_1.default.throws(() => (0, circuit_1.getCircuit)(UNKNOW_CIRCUIT_FAMILY, UNKNOW_CIRCUIT.toCode()));
        });
        (0, mocha_1.it)('should throw error when the circuit family unknow', () => {
            assert_1.default.throws(() => (0, circuit_1.getCircuit)(UNKNOW_CIRCUIT_FAMILY, PRE_DEFINED_CIRCUIT30.toCode()));
        });
        (0, mocha_1.it)('should throw error when the circuit code unknow', () => {
            assert_1.default.throws(() => (0, circuit_1.getCircuit)(constants_1.default.CIRCUIT_FAMILY, UNKNOW_CIRCUIT.toCode()));
        });
        (0, mocha_1.it)('should return circuit when the circuit family and code match', () => {
            constants_1.default.CIRCUIT_DEFINED.forEach((target) => {
                const circuit = new circuit_1.ZKCircuit(target);
                const res = (0, circuit_1.getCircuit)(constants_1.default.CIRCUIT_FAMILY, circuit.toCode());
                assert_1.default.strictEqual(res instanceof circuit_1.ZKCircuit, true);
                assert_1.default.deepStrictEqual(res, circuit);
            });
        });
    });
    (0, mocha_1.describe)('#createCircuit()', () => {
        (0, mocha_1.it)('should return ZKCircuit when the circuit family unknow and code unknow', () => {
            const unknowCircuit = {
                target: Math.random() * 1e8,
                toCode() {
                    return (0, tool_1.stringKeccak256)(this.target.toString(16));
                },
            };
            const res = (0, circuit_1.createCircuit)(UNKNOW_CIRCUIT_FAMILY, unknowCircuit);
            assert_1.default.strictEqual(res instanceof circuit_1.ZKCircuit, true);
            assert_1.default.strictEqual(res.target, unknowCircuit.target);
            assert_1.default.strictEqual(res.toHash(), unknowCircuit.toCode());
        });
        (0, mocha_1.it)('should return ZKCircuit when the circuit family unknow', () => {
            const res = (0, circuit_1.createCircuit)(UNKNOW_CIRCUIT_FAMILY, PRE_DEFINED_CIRCUIT30);
            assert_1.default.strictEqual(res instanceof circuit_1.ZKCircuit, true);
            assert_1.default.strictEqual(res.target, PRE_DEFINED_CIRCUIT30.target);
            assert_1.default.strictEqual(res.toHash(), PRE_DEFINED_CIRCUIT30.toCode());
        });
        (0, mocha_1.it)('should return ZKCircuit when the circuit code unknow', () => {
            const unknowCircuit = {
                target: Math.random() * 1e8,
                toCode() {
                    return (0, tool_1.stringKeccak256)(this.target.toString(16));
                },
            };
            const res = (0, circuit_1.createCircuit)(constants_1.default.CIRCUIT_FAMILY, unknowCircuit);
            assert_1.default.strictEqual(res instanceof circuit_1.ZKCircuit, true);
            assert_1.default.strictEqual(res.target, unknowCircuit.target);
            assert_1.default.strictEqual(res.toHash(), unknowCircuit.toCode());
        });
        (0, mocha_1.it)('should throw error when the circuit family and code create already', () => {
            constants_1.default.CIRCUIT_DEFINED.forEach((target) => {
                const circuit = new circuit_1.ZKCircuit(target);
                assert_1.default.throws(() => (0, circuit_1.createCircuit)(constants_1.default.CIRCUIT_FAMILY, circuit));
            });
        });
    });
});
