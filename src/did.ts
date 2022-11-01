import { getContentByKey, setContentByKey } from './lib/cache';
import { address, CacheType, DID } from './types';
const DIDKit = this === window ? require('@spruceid/didkit-wasm') : require('@spruceid/didkit-wasm-node');

/**
 * @param address - Metamask address
 * @returns `true` if `address` has an DID or `false` otherwise
 */
export const hasDID = (address: address): boolean => {
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
  const did = getContentByKey(CacheType.DID, address);
  if (!did) throw Error("DID doesn't exist");
  return did;
};

/**
 * @remark This method creates a new DID and assigns it to `address`.
 *         For simplicity, signature is NOT required and a Metamask address can create only one DID
 * @param address - The owner (Metamask address) of DID being created
 * @returns An instance of new DID (e.g., did:key:z6MksFwai2iBGRQdai5KSFP9FsPvZPnYY2FshK2mJ7nrYwZx)
 * @throws Error if DID already exists
 */
export const createDID = (address: string): DID => {
  if (hasDID(address)) throw Error('DID already exists');

  const key = DIDKit.generateEd25519Key();
  const did = { id: DIDKit.keyToDID('key', key) };
  setContentByKey(CacheType.DID, address, did);
  return did;
};

export const isDID = (did: any): did is DID => {
  if (typeof did !== 'object') return false;
  if (!did) return false;
  if (!('id' in did)) return false;
  if (typeof did.id !== 'string') return false;
  if (!did.id) return false;
  return true;
};

export const didEqual = (didA: DID, didB: DID) => {
  if (!isDID(didA)) return false;
  if (!isDID(didB)) return false;
  return didA.id === didB.id;
};
