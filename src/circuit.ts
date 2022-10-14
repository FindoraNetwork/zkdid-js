import { getContentByKey, setContentByKey } from './lib/cache';
import { ZKCredential } from './credential';
import { IConstrait, ConstraintINT_RNG, ConstraintSTR_RNG } from './constraints';
import Constants from './lib/constants';
import { stringKeccak256 } from './lib/tool';
import { CacheType } from './types';

// ZK circuit interfaces ////////////////////////////////////////////////////////////////////////////////////
// `circuit.ts`

// An extendable family of circuits
// const CIRCUIT_FAMILY = stringKeccak256('ZKCircuitFamily').slice(-Constants.HashLen);

// Some predefined ZK circuit for single number comparasion (range)
export interface ICircuit {
  toCode(): string;
  toBytes(): string;
  fromBytes(bytes: string): ICircuit;
  verify(fields: Map<string, number | string>): boolean;
}

// Some predefined ZK circuit for single number comparasion (range)
export class ZKCircuitNumberRNG implements ICircuit {
  constraints: Array<IConstrait> = [];
  constructor(constraints: Array<IConstrait> = []) {
    this.constraints = constraints;
  }
  addConstrait(constrait: IConstrait) {
    this.constraints.push(constrait);
  }
  toCode(): string {
    return stringKeccak256(JSON.stringify(this));
  }
  toBytes(): string {
    throw new Error('Method not implemented.');
  }
  fromBytes(bytes: string): ZKCircuitNumberRNG {
    throw new Error('Method not implemented.');
  }
  verify(fields: Map<string, number | string>): boolean {
    // verify zkCred against each contrait in `constraints` array

    // Implementation:
    // step-1: Decode `zkCred.zkproof` with Base64. (The verifier pretends that he can't see/decode the actual values)
    // step-2: Compare decoded values aginst deserialized circuit (e.g., `ZKCircuitNumberRNG` object)
    //         Return `true` only if all constraints in the circuit MUST pass.
    //         Return `false` if any of the constraints fails.
    //         Throw error when field name not matching the circuit.
    //
    /* Example:
    // decode ZKCredential
    // get field value from `ZKCredential`
    for(let i=0; i < this.constraints.length; i++) {
      value = fields.get(this.constraints[i].getField());
      this.constraints[i].verify(value)
    }
    */
    return true;
  }
}

// APIs to extend predefined circuit family

/**
 * @param family - The circuit family
 * @param code - The circuit code
 * @returns `true` if the circuit exists or `false` otherwise
 */
export const hasCircuit = (family: string, code: string): boolean => {
  // Implementation
  // 1> Check existence of circuit in localStorage by key (e.g., `{$CIRCUIT_KEY_RNG30}`)

  const key = [family, code].join(':');
  const circuit = getContentByKey(CacheType.CIRCUIT_FAMILY, key);
  if (!circuit) return false;
  return true;
};

/**
 * @param family - The circuit family
 * @param code - The circuit code
 * @returns The circuit instance
 * @throws Error if circuit doesn't exist
 */
export const getCircuit = <TCircuit extends ICircuit>(family: string, code: string): ICircuit => {
  // if (!hasCircuit(family, code)) throw Error("Circuit doesn't exist");

  // Implementation
  // 1> Get circuit from localStorage by key (e.g., `{$CIRCUIT_KEY_RNG30}`)

  const key = [family, code].join(':');
  const bytes = getContentByKey(CacheType.CIRCUIT_FAMILY, key);
  if (!bytes) throw Error("Circuit doesn't exist");
  const circuit: TCircuit = {} as TCircuit;
  return circuit.fromBytes(bytes);
};

/**
 * @remark This method creates a new circuit
 * @param family - The circuit family
 * @param circuit - The ICircuit
 * @returns An instance of new circuit
 * @throws Error if circuit already exists
 */
export const createCircuit = (family: string, circuit: ICircuit): void => {
  // calculate the code [family+circuit_hash]
  // let code = '';
  // if (hasCircuit(family, code)) throw Error('Circuit already exists');
  // Implementation
  // 1> Create and save circuit in localStorage by key (e.g., `{$CIRCUIT_KEY_RNG30}`)

  const key = [family, circuit.toCode()].join(':');
  const bytes = getContentByKey(CacheType.CIRCUIT_FAMILY, key);
  if (bytes) throw Error('Circuit already exists');

  setContentByKey(CacheType.CIRCUIT_FAMILY, key, circuit.toBytes());
};

// Implementation
// 1> Save below 7 predefined circuits into localStorage on initialization
// 3> Serialize and save each circuit under their own key (e.g., `{$CIRCUIT_KEY_RNG30}`)
//    Real-world circuits will be probably built and published on blockchain.
for (const [field, lower] of Constants.CIRCUIT_DEFINED) {
  const circuit = new ZKCircuitNumberRNG([new ConstraintINT_RNG(field, lower)]);
  createCircuit(Constants.CIRCUIT_FAMILY, circuit);
}
