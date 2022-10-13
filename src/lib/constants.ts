import { stringKeccak256 } from './tool';

const HashLen = 40;
const CIRCUIT_DEFINED: [string, number][] = [
  ['GPAScore', 3.0],
  ['GPAScore', 3.5],
  ['creditScore', 650],
  ['creditScore', 700],
  ['annualIncomeUsd', 65000],
  ['annualIncomeUsd', 80000],
  ['annualIncomeUsd', 95000],
];

const Constants = {
  localStorageKeyPrefix: 'did.findora:KeyPrefix:',
  HashLen,
  CIRCUIT_FAMILY: stringKeccak256('ZKCircuitFamily'),
  CIRCUIT_DEFINED,
};

export default Constants;
