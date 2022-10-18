"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCircuit = exports.getCircuit = exports.hasCircuit = exports.ZKCircuit = void 0;
const cache_1 = require("./lib/cache");
const constraints_1 = require("./constraints");
const tool_1 = require("./lib/tool");
const types_1 = require("./types");
const credential_1 = require("./credential");
// ZK circuit interface
class ZKCircuit {
    constructor(constraints = []) {
        this.constraints = [];
        this.constraints = constraints;
    }
    addConstraint(constraint) {
        this.constraints.push(constraint);
    }
    toCode() {
        return (0, tool_1.stringKeccak256)(this.toBytes());
    }
    toBytes() {
        const strThis = this.constraints.map((ctr) => ctr.serialize());
        const keys = this.constraints.map((ctr) => (0, constraints_1.getKeyOfConstraint)(ctr));
        return JSON.stringify([strThis, keys]);
    }
    static fromBytes(bytes) {
        const bytesObj = JSON.parse(bytes);
        const constraints = bytesObj[1].map((key, index) => {
            const argStr = bytesObj[0][index];
            const arg = JSON.parse(argStr);
            const Class = (0, constraints_1.getConstraintByKey)(key);
            return new Class(...arg);
        });
        return new ZKCircuit(constraints);
    }
    verify(fields) {
        // verify `fields` against every contrait
        // Implementation:
        //
        // Example:
        for (let i = 0; i < this.constraints.length; i++) {
            const field = this.constraints[i].getField();
            const value = fields.get(field);
            if (!this.constraints[i].verify(value))
                return false;
        }
        return true;
    }
}
exports.ZKCircuit = ZKCircuit;
const circuitPath = (purpose, code) => {
    return [purpose, code].join(':');
};
// APIs to extend circuit family
/**
 * @param purpose - The purpose code
 * @param code - The circuit code
 * @returns `true` if the circuit exists or `false` otherwise
 */
const hasCircuit = (purpose, code) => {
    const path = circuitPath(purpose, code);
    const circuit = (0, cache_1.getContentByKey)(types_1.CacheType.CIRCUIT, path);
    if (!circuit)
        return false;
    return true;
};
exports.hasCircuit = hasCircuit;
/**
 * @param purpose - The purpose code
 * @param code - The circuit code
 * @returns The circuit instance
 * @throws Error if circuit doesn't exist
 */
const getCircuit = (purpose, code) => {
    const path = circuitPath(purpose, code);
    const bytes = (0, cache_1.getContentByKey)(types_1.CacheType.CIRCUIT, path);
    if (!bytes)
        throw Error("Circuit doesn't exist");
    return ZKCircuit.fromBytes(bytes);
};
exports.getCircuit = getCircuit;
/**
 * @remark This method creates a new circuit under `family`
 * @param purpose - The purpose code
 * @param circuit - The circuit instance
 * @throws Error if circuit already exists
 */
const createCircuit = (purpose, circuit) => {
    const key = circuitPath(purpose, circuit.toCode());
    const bytes = (0, cache_1.getContentByKey)(types_1.CacheType.CIRCUIT, key);
    if (bytes)
        throw Error('Circuit already exists');
    (0, cache_1.setContentByKey)(types_1.CacheType.CIRCUIT, key, circuit.toBytes());
};
exports.createCircuit = createCircuit;
// Create predefined circuits for GPA
for (const constraint of constraints_1.CONSTRAINTS_GPA) {
    const purpose = credential_1.GPACredential.purpose();
    const circuit = new ZKCircuit([constraint]);
    if (!(0, exports.hasCircuit)(purpose, circuit.toCode())) {
        (0, exports.createCircuit)(purpose, circuit);
    }
}
// Create predefined circuits for credit score
for (const constraint of constraints_1.CONSTRAINTS_CREDITS) {
    const purpose = credential_1.CreditScoreCredential.purpose();
    const circuit = new ZKCircuit([constraint]);
    if (!(0, exports.hasCircuit)(purpose, circuit.toCode())) {
        (0, exports.createCircuit)(purpose, circuit);
    }
}
// Create predefined circuits for income
for (const constraint of constraints_1.CONSTRAINTS_CREDITS) {
    const purpose = credential_1.AnnualIncomeCredential.purpose();
    const circuit = new ZKCircuit([constraint]);
    if (!(0, exports.hasCircuit)(purpose, circuit.toCode())) {
        (0, exports.createCircuit)(purpose, circuit);
    }
}
