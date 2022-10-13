import { keccak256 } from '@ethersproject/solidity';

export const sleep = (s = 200) => new Promise((r) => setTimeout(r, s));
export const callApi = (min = 2000, max = 5000) => sleep(Math.random() * (max - min) + min);

export const isDID = (did: any) => {
  if (!did) return false;
  if (typeof did !== 'object') return false;
  if (!('id' in did)) return false;
  if (typeof did.id !== 'string') return false;
  if (!did.id) return false;
  return true;
};

export const stringKeccak256 = (str: string) => keccak256(['string'], [str]);
