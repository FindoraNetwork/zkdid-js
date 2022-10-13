import { stringKeccak256 } from './tool';

const HashLen = 40;

const Constants = {
  localStorageKeyPrefix: 'did.findora:KeyPrefix:',
  HashLen,
  CIRCUIT_FAMILY: stringKeccak256('ZKCircuitFamily'),

  CIRCUIT_DEFINED: [3.0, 3.5, 650, 700, 65000, 80000, 95000],
};

export default Constants;
