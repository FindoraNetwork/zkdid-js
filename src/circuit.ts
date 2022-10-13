import { getContentByKey, setContentByKey } from './lib/cache';
import Constants from './lib/constants';
import { stringKeccak256 } from './lib/tool';
import { CacheType } from './types';

// ZK circuit interfaces ////////////////////////////////////////////////////////////////////////////////////
// `circuit.ts`

// An extendable family of circuits
// const CIRCUIT_FAMILY = stringKeccak256('ZKCircuitFamily').slice(-Constants.HashLen);

// Some predefined ZK circuit for single number comparasion (no less than)
export interface ICircuit {
  target: number;
  getHash(): string;
}

// Some predefined ZK circuit for single number comparasion (no less than)
export class ZKCircuitNumberNLT implements ICircuit {
  target: number;
  constructor(target: number) {
    this.target = target;
  }
  getHash(): string {
    return stringKeccak256(JSON.stringify(this));
  }
  getTarget(): number {
    return this.target;
  }
}

// Implementation
// 1> Save below 7 predefined circuits into localStorage on initialization
// 3> Serialize and save each circuit under their own key (e.g., `{$CIRCUIT_KEY_NLT30}`)
//    Real-world circuits will be probably built and published on blockchain.
Constants.CIRCUIT_DEFINED.forEach((target) => {
  const circuit = new ZKCircuitNumberNLT(target);
  const key = [Constants.CIRCUIT_FAMILY, circuit.getHash()].join(':');
  setContentByKey(CacheType.CIRCUIT_FAMILY, key, circuit);
});

// APIs to extend predefined circuit family

/**
 * @param family - The circuit family
 * @param code - The circuit code
 * @returns `true` if the circuit exists or `false` otherwise
 */
export const hasCircuit = (family: string, code: string): boolean => {
  // Implementation
  // 1> Check existence of circuit in localStorage by key (e.g., `{$CIRCUIT_KEY_NLT30}`)

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
export const getCircuit = (family: string, code: string): ZKCircuitNumberNLT => {
  // if (!hasCircuit(family, code)) throw Error("Circuit doesn't exist");

  // Implementation
  // 1> Get circuit from localStorage by key (e.g., `{$CIRCUIT_KEY_NLT30}`)

  const key = [family, code].join(':');
  const circuit = getContentByKey(CacheType.CIRCUIT_FAMILY, key);
  if (!circuit) throw Error("Circuit doesn't exist");
  return new ZKCircuitNumberNLT(circuit.target);
};

/**
 * @remark This method creates a new circuit
 * @param family - The circuit family
 * @param circuit - The ICircuit
 * @returns An instance of new circuit
 * @throws Error if circuit already exists
 */
export const createCircuit = (family: string, circuit: ICircuit): ZKCircuitNumberNLT => {
  // calculate the code [family+circuit_hash]
  // let code = '';
  // if (hasCircuit(family, code)) throw Error('Circuit already exists');
  // Implementation
  // 1> Create and save circuit in localStorage by key (e.g., `{$CIRCUIT_KEY_NLT30}`)
  const zkCircuit = new ZKCircuitNumberNLT(circuit.target);

  const key = [family, zkCircuit.getHash()].join(':');
  const check = getContentByKey(CacheType.CIRCUIT_FAMILY, key);
  if (check) throw Error('Circuit already exists');

  setContentByKey(CacheType.CIRCUIT_FAMILY, key, zkCircuit);
  return zkCircuit;
};
