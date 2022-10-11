import { keccak256 } from '@ethersproject/keccak256';
import { getContentByKey, setContentByKey } from './lib/cache';
import Constants from './lib/constants';

// ZK circuit interfaces ////////////////////////////////////////////////////////////////////////////////////
// `circuit.ts`

// An extendable family of circuits
// const CIRCUIT_FAMILY = keccak256('ZKCircuitFamily').slice(-Constants.HashLen);

// Some predefined ZK circuit for single number comparasion (no less than)
export class ZKCircuitNumberNLT {
  target: number;
  constructor(target: number) {
    this.target = target;

    const key = keccak256(JSON.stringify(this));
    setContentByKey(CacheType.CIRCUIT, key, this);
  }
}

// Implementation
// 1> Save below 7 predefined circuits into localStorage on initialization
// 3> Serialize and save each circuit under their own key (e.g., `{$CIRCUIT_KEY_NLT30}`)
//    Real-world circuits will be probably built and published on blockchain.
const CIRCUIT_CODE_NLT30 = keccak256(JSON.stringify(new ZKCircuitNumberNLT(3.0)));
const CIRCUIT_CODE_NLT35 = keccak256(JSON.stringify(new ZKCircuitNumberNLT(3.5)));
const CIRCUIT_CODE_NLT650 = keccak256(JSON.stringify(new ZKCircuitNumberNLT(650)));
const CIRCUIT_CODE_NLT700 = keccak256(JSON.stringify(new ZKCircuitNumberNLT(700)));
const CIRCUIT_CODE_NLT65K = keccak256(JSON.stringify(new ZKCircuitNumberNLT(65000)));
const CIRCUIT_CODE_NLT80K = keccak256(JSON.stringify(new ZKCircuitNumberNLT(80000)));
const CIRCUIT_CODE_NLT95K = keccak256(JSON.stringify(new ZKCircuitNumberNLT(95000)));

const CIRCUIT_KEY_NLT30 = Constants.CIRCUIT_FAMILY.concat(CIRCUIT_CODE_NLT30).slice(-Constants.HashLen);
const CIRCUIT_KEY_NLT35 = Constants.CIRCUIT_FAMILY.concat(CIRCUIT_CODE_NLT35).slice(-Constants.HashLen);
const CIRCUIT_KEY_NLT650 = Constants.CIRCUIT_FAMILY.concat(CIRCUIT_CODE_NLT650).slice(-Constants.HashLen);
const CIRCUIT_KEY_NLT700 = Constants.CIRCUIT_FAMILY.concat(CIRCUIT_CODE_NLT700).slice(-Constants.HashLen);
const CIRCUIT_KEY_NLT65K = Constants.CIRCUIT_FAMILY.concat(CIRCUIT_CODE_NLT65K).slice(-Constants.HashLen);
const CIRCUIT_KEY_NLT80K = Constants.CIRCUIT_FAMILY.concat(CIRCUIT_CODE_NLT80K).slice(-Constants.HashLen);
const CIRCUIT_KEY_NLT95K = Constants.CIRCUIT_FAMILY.concat(CIRCUIT_CODE_NLT95K).slice(-Constants.HashLen);

{
  setContentByKey(CacheType.CIRCUIT_FAMILY, CIRCUIT_KEY_NLT30, true);
  setContentByKey(CacheType.CIRCUIT_FAMILY, CIRCUIT_KEY_NLT35, true);
  setContentByKey(CacheType.CIRCUIT_FAMILY, CIRCUIT_KEY_NLT650, true);
  setContentByKey(CacheType.CIRCUIT_FAMILY, CIRCUIT_KEY_NLT700, true);
  setContentByKey(CacheType.CIRCUIT_FAMILY, CIRCUIT_KEY_NLT65K, true);
  setContentByKey(CacheType.CIRCUIT_FAMILY, CIRCUIT_KEY_NLT80K, true);
  setContentByKey(CacheType.CIRCUIT_FAMILY, CIRCUIT_KEY_NLT95K, true);
}

// APIs to extend predefined circuit family

/**
 * @param family - The circuit family
 * @param code - The circuit code
 * @returns `true` if the circuit exists or `false` otherwise
 */
export const hasCircuit = (family: string, code: string): boolean => {
  // Implementation
  // 1> Check existence of circuit in localStorage by key (e.g., `{$CIRCUIT_KEY_NLT30}`)

  const key = family.concat(code).slice(-Constants.HashLen);
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
  if (!hasCircuit(family, code)) throw Error("Circuit doesn't exist");

  // Implementation
  // 1> Get circuit from localStorage by key (e.g., `{$CIRCUIT_KEY_NLT30}`)
  const circuit = getContentByKey(CacheType.CIRCUIT, code);
  if (!circuit) throw Error("Circuit doesn't exist");
  return circuit;
};

/**
 * @remark This method creates a new circuit
 * @param family - The circuit family
 * @param code - The circuit code
 * @returns An instance of new circuit
 * @throws Error if circuit already exists
 */
export const createCircuit = (family: string, code: string): ZKCircuitNumberNLT => {
  if (hasCircuit(family, code)) throw Error('Circuit already exists');

  // Implementation
  // 1> Create and save circuit in localStorage by key (e.g., `{$CIRCUIT_KEY_NLT30}`)

  // const CIRCUIT_CODE = keccak256(JSON.stringify(new ZKCircuitNumberNLT(95000)));
  // const CIRCUIT_KEY_NLT30 = CIRCUIT_FAMILY.concat(CIRCUIT_CODE_NLT30).slice(-Constants.HashLen);
  return {
    target: 0,
  };
};
