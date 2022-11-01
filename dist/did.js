"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.didEqual = exports.isDID = exports.createDID = exports.getDID = exports.hasDID = void 0;
const cache_1 = require("./lib/cache");
const types_1 = require("./types");
const DIDKit = this === window ? require('@spruceid/didkit-wasm') : require('@spruceid/didkit-wasm-node');
/**
 * @param address - Metamask address
 * @returns `true` if `address` has an DID or `false` otherwise
 */
const hasDID = (address) => {
    const did = (0, cache_1.getContentByKey)(types_1.CacheType.DID, address);
    if (!did)
        return false;
    return true;
};
exports.hasDID = hasDID;
/**
 * @param address - Metamask address
 * @returns The DID instance owned by `address`
 * @throws Error if DID doesn't exist
 */
const getDID = (address) => {
    const did = (0, cache_1.getContentByKey)(types_1.CacheType.DID, address);
    if (!did)
        throw Error("DID doesn't exist");
    return did;
};
exports.getDID = getDID;
/**
 * @remark This method creates a new DID and assigns it to `address`.
 *         For simplicity, signature is NOT required and a Metamask address can create only one DID
 * @param address - The owner (Metamask address) of DID being created
 * @returns An instance of new DID (e.g., did:key:z6MksFwai2iBGRQdai5KSFP9FsPvZPnYY2FshK2mJ7nrYwZx)
 * @throws Error if DID already exists
 */
const createDID = (address) => {
    if ((0, exports.hasDID)(address))
        throw Error('DID already exists');
    const key = DIDKit.generateEd25519Key();
    const did = { id: DIDKit.keyToDID('key', key) };
    (0, cache_1.setContentByKey)(types_1.CacheType.DID, address, did);
    return did;
};
exports.createDID = createDID;
const isDID = (did) => {
    if (typeof did !== 'object')
        return false;
    if (!did)
        return false;
    if (!('id' in did))
        return false;
    if (typeof did.id !== 'string')
        return false;
    if (!did.id)
        return false;
    return true;
};
exports.isDID = isDID;
const didEqual = (didA, didB) => {
    if (!(0, exports.isDID)(didA))
        return false;
    if (!(0, exports.isDID)(didB))
        return false;
    return didA.id === didB.id;
};
exports.didEqual = didEqual;
