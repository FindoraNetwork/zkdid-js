import { keccak256 } from '@ethersproject/keccak256';

const HashLen = 40;

const Constants = {
  localStorageKeyPrefix: 'did.findora:KeyPrefix:',
  HashLen,
  CIRCUIT_FAMILY: keccak256('ZKCircuitFamily').slice(-HashLen),
};

export default Constants;
