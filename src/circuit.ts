import { getContentByKey, setContentByKey } from './lib/cache';
import {
  IConstraint,
  CONSTRAINTS_GPA,
  CONSTRAINTS_CREDITS,
  CONSTRAINTS_INCOME,
  CONSTRAINT_GPA_30,
  CONSTRAINT_GPA_35,
  CONSTRAINT_CREDIT_650,
  CONSTRAINT_CREDIT_700,
  CONSTRAINT_INCOME_65K,
  CONSTRAINT_INCOME_80K,
  CONSTRAINT_INCOME_95K,
  getKeyOfConstraint,
  getConstraintByKey,
} from './constraints';
import { stringKeccak256 } from './lib/tool';
import { CacheType } from './types';
import { AnnualIncomeCredential, CreditScoreCredential, GPACredential } from './credential';

// ZK circuit interface
export class ZKCircuit {
  private constraints: Array<IConstraint> = [];
  constructor(constraints: Array<IConstraint> = []) {
    this.constraints = constraints;
  }
  addConstraint(constraint: IConstraint) {
    this.constraints.push(constraint);
  }
  toCode(): string {
    return stringKeccak256(this.toBytes());
  }
  toBytes(): string {
    const strThis = this.constraints.map((ctr) => ctr.serialize());
    const keys = this.constraints.map((ctr) => getKeyOfConstraint(ctr));
    return JSON.stringify([strThis, keys]);
  }
  static fromBytes(bytes: string): ZKCircuit {
    const bytesObj: [string[], number[]] = JSON.parse(bytes);
    const constraints = bytesObj[1].map((key, index) => {
      const argStr = bytesObj[0][index];
      const arg: any[] = JSON.parse(argStr);
      const Class = getConstraintByKey(key);
      return new Class(...arg);
    });
    return new ZKCircuit(constraints);
  }
  verify(fields: Map<string, number | string>): boolean {
    // verify `fields` against every contrait
    for (let i = 0; i < this.constraints.length; i++) {
      const field = this.constraints[i].getField();
      const value = fields.get(field);
      if (!this.constraints[i].verify(value)) return false;
    }
    return true;
  }
}

const circuitPath = (purpose: string, code: string): string => {
  return [purpose, code].join(':');
};

// APIs to build/fetch ZK circuit

/**
 * @param purpose - The purpose code
 * @param code - The circuit code
 * @returns `true` if the circuit exists or `false` otherwise
 */
export const hasCircuit = (purpose: string, code: string): boolean => {
  const path = circuitPath(purpose, code);
  const circuit = getContentByKey(CacheType.CIRCUIT, path);
  if (!circuit) return false;
  return true;
};

/**
 * @param purpose - The purpose code
 * @param code - The circuit code
 * @returns The circuit instance
 * @throws Error if circuit doesn't exist
 */
export const getCircuit = (purpose: string, code: string): ZKCircuit => {
  const path = circuitPath(purpose, code);
  const bytes = getContentByKey(CacheType.CIRCUIT, path);
  if (!bytes) throw Error("Circuit doesn't exist");
  return ZKCircuit.fromBytes(bytes);
};

/**
 * @remark This method creates a new circuit under `purpose`
 * @param purpose - The purpose code
 * @param circuit - The circuit instance
 * @throws Error if circuit already exists
 */
export const createCircuit = (purpose: string, circuit: ZKCircuit): void => {
  const key = circuitPath(purpose, circuit.toCode());
  const bytes = getContentByKey(CacheType.CIRCUIT, key);
  if (bytes) throw Error('Circuit already exists');
  setContentByKey(CacheType.CIRCUIT, key, circuit.toBytes());
};

// Publish predefined circuit codes
export const CODE_GPA_30 = new ZKCircuit([CONSTRAINT_GPA_30]).toCode();
export const CODE_GPA_35 = new ZKCircuit([CONSTRAINT_GPA_35]).toCode();
export const CODE_CREDIT_650 = new ZKCircuit([CONSTRAINT_CREDIT_650]).toCode();
export const CODE_CREDIT_700 = new ZKCircuit([CONSTRAINT_CREDIT_700]).toCode();
export const CODE_INCOME_65K = new ZKCircuit([CONSTRAINT_INCOME_65K]).toCode();
export const CODE_INCOME_80K = new ZKCircuit([CONSTRAINT_INCOME_80K]).toCode();
export const CODE_INCOME_95K = new ZKCircuit([CONSTRAINT_INCOME_95K]).toCode();

// Create predefined circuits for GPA
for (const constraint of CONSTRAINTS_GPA) {
  const purpose = GPACredential.purpose();
  const circuit = new ZKCircuit([constraint]);
  if (!hasCircuit(purpose, circuit.toCode())) {
    createCircuit(purpose, circuit);
  }
}

// Create predefined circuits for credit score
for (const constraint of CONSTRAINTS_CREDITS) {
  const purpose = CreditScoreCredential.purpose();
  const circuit = new ZKCircuit([constraint]);
  if (!hasCircuit(purpose, circuit.toCode())) {
    createCircuit(purpose, circuit);
  }
}

// Create predefined circuits for income
for (const constraint of CONSTRAINTS_INCOME) {
  const purpose = AnnualIncomeCredential.purpose();
  const circuit = new ZKCircuit([constraint]);
  if (!hasCircuit(purpose, circuit.toCode())) {
    createCircuit(purpose, circuit);
  }
}
