"use strict";
// ZK constraints
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONSTRAINTS_INCOME = exports.CONSTRAINTS_CREDITS = exports.CONSTRAINTS_GPA = exports.CONSTRAINT_INCOME_95K = exports.CONSTRAINT_INCOME_80K = exports.CONSTRAINT_INCOME_65K = exports.CONSTRAINT_CREDIT_700 = exports.CONSTRAINT_CREDIT_650 = exports.CONSTRAINT_GPA_35 = exports.CONSTRAINT_GPA_30 = exports.ConstraintSTR_RNG = exports.ConstraintINT_RNG = exports.getConstraintByKey = exports.getKeyOfConstraint = exports.registerConstraint = exports.IConstraint = exports.Constraints = void 0;
exports.Constraints = [];
class IConstraint {
    constructor(field) {
        this.field = field;
    }
    getField() {
        return this.field;
    }
}
exports.IConstraint = IConstraint;
const registerConstraint = (ConstraintClass) => {
    exports.Constraints.push(ConstraintClass);
};
exports.registerConstraint = registerConstraint;
const getKeyOfConstraint = (ctr) => {
    const ctrClass = exports.Constraints.find((v) => ctr instanceof v);
    if (!ctrClass)
        throw new Error('Unregistered Constraint');
    return exports.Constraints.indexOf(ctrClass);
};
exports.getKeyOfConstraint = getKeyOfConstraint;
const getConstraintByKey = (key) => {
    return exports.Constraints[key];
};
exports.getConstraintByKey = getConstraintByKey;
// The contraint to verify range proof on number
class ConstraintINT_RNG extends IConstraint {
    constructor(field, lower, upper = Number.MAX_SAFE_INTEGER) {
        super(field);
        this.lower = lower;
        this.upper = upper;
    }
    verify(value) {
        if (typeof value === 'number') {
            return value >= this.lower && value <= this.upper;
        }
        throw new Error(`Expected number, got '${typeof value}'.`);
    }
    serialize() {
        return JSON.stringify([this.getField(), this.lower, this.upper]);
    }
}
exports.ConstraintINT_RNG = ConstraintINT_RNG;
(0, exports.registerConstraint)(ConstraintINT_RNG);
// The contraint to verify range proof on string
class ConstraintSTR_RNG extends IConstraint {
    constructor(field, range) {
        super(field);
        this.range = range;
    }
    verify(value) {
        if (typeof value === 'string') {
            return this.range.indexOf(value) > -1;
        }
        throw new Error(`Expected string, got '${typeof value}'.`);
    }
    serialize() {
        return JSON.stringify([this.getField(), this.range]);
    }
}
exports.ConstraintSTR_RNG = ConstraintSTR_RNG;
(0, exports.registerConstraint)(ConstraintSTR_RNG);
// Some predefined constraints
exports.CONSTRAINT_GPA_30 = new ConstraintINT_RNG('GPAScore', 3.0);
exports.CONSTRAINT_GPA_35 = new ConstraintINT_RNG('GPAScore', 3.5);
exports.CONSTRAINT_CREDIT_650 = new ConstraintINT_RNG('creditScore', 650);
exports.CONSTRAINT_CREDIT_700 = new ConstraintINT_RNG('creditScore', 700);
exports.CONSTRAINT_INCOME_65K = new ConstraintINT_RNG('creditScore', 65000);
exports.CONSTRAINT_INCOME_80K = new ConstraintINT_RNG('creditScore', 80000);
exports.CONSTRAINT_INCOME_95K = new ConstraintINT_RNG('creditScore', 95000);
exports.CONSTRAINTS_GPA = [exports.CONSTRAINT_GPA_30, exports.CONSTRAINT_GPA_35];
exports.CONSTRAINTS_CREDITS = [exports.CONSTRAINT_CREDIT_650, exports.CONSTRAINT_CREDIT_700];
exports.CONSTRAINTS_INCOME = [exports.CONSTRAINT_INCOME_65K, exports.CONSTRAINT_INCOME_80K, exports.CONSTRAINT_INCOME_95K];
