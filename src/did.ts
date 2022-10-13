import { getContentByKey, setContentByKey } from './lib/cache';
import DIDKit from '@spruceid/didkit';
import { address, CacheType, DID } from './types';

// DID interfaces ///////////////////////////////////////////////////////////////////////////////////////////
// `did.ts`

/**
 * @param address - Metamask address
 * @returns `true` if `address` has an DID or `false` otherwise
 */
export const hasDID = (address: address): boolean => {
  // Implementation
  // 1> Check existence of DID in localStorage

  const did = getContentByKey(CacheType.DID, address);
  if (!did) return false;
  return true;
};

/**
 * @param address - Metamask address
 * @returns The DID instance owned by `address`
 * @throws Error if DID doesn't exist
 */
export const getDID = (address: address): DID => {
  // if (!hasDID(address)) throw Error("DID doesn't exist");

  // Implementation
  // 1> Get DID from localStorage

  const did = getContentByKey(CacheType.DID, address);
  if (!did) throw Error("DID doesn't exist");
  return did;
};

/**
 * @remark This method creates a new DID and assigns it to `address`
 * @param address - The owner (Metamask address) of DID being created
 * @returns An instance of new DID (e.g., did:key:z6MksFwai2iBGRQdai5KSFP9FsPvZPnYY2FshK2mJ7nrYwZx)
 * @throws Error if DID already exists
 */
export const createDID = (address: string): DID => {
  if (hasDID(address)) throw Error('DID already exists');

  // Implementation
  // 1> Create and save DID in localStorage
  // 2> Use SpruceID (https://www.npmjs.com/package/@spruceid/didkit-wasm) API to generate DID.
  //    Here is a 5-line of example: https://www.spruceid.dev/didkit/didkit-packages/javascript
  // 3> Assign/link newly created DID to `address`

  const key = DIDKit.generateEd25519Key();
  const did = { id: DIDKit.keyToDID('key', key) };
  setContentByKey(CacheType.DID, address, did);
  return did;
};
