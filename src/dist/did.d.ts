import { DID } from './types';
/**
 * @param address - Metamask address
 * @returns `true` if `address` has an DID or `false` otherwise
 */
export declare const hasDID: (address: string) => boolean;
/**
 * @param address - Metamask address
 * @returns The DID instance owned by `address`
 * @throws Error if DID doesn't exist
 */
export declare const getDID: (address: string) => DID;
/**
 * @remark This method creates a new DID and assigns it to `address`.
 *         For simplicity, signature is NOT required and a Metamask address can create only one DID
 * @param address - The owner (Metamask address) of DID being created
 * @returns An instance of new DID (e.g., did:key:z6MksFwai2iBGRQdai5KSFP9FsPvZPnYY2FshK2mJ7nrYwZx)
 * @throws Error if DID already exists
 */
export declare const createDID: (address: string) => DID;
export declare const isDID: (did: any) => did is DID;
export declare const didEqual: (didA: DID, didB: DID) => boolean;
