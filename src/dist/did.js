"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.didEqual = exports.isDID = exports.createDID = exports.getDID = exports.hasDID = void 0;
const cache_1 = require("./lib/cache");
const didkit_wasm_1 = __importDefault(require("@spruceid/didkit-wasm"));
const types_1 = require("./types");
// DID interfaces ///////////////////////////////////////////////////////////////////////////////////////////
/**
 * @param address - Metamask address
 * @returns `true` if `address` has an DID or `false` otherwise
 */
const hasDID = (address) => {
    // Implementation
    // 1> Check existence of DID in localStorage
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
    // if (!hasDID(address)) throw Error("DID doesn't exist");
    // Implementation
    // 1> Get DID from localStorage
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
    // Implementation
    // 1> Create and save DID in localStorage
    // 2> Use SpruceID (https://www.npmjs.com/package/@spruceid/didkit-wasm) API to generate DID.
    //    Here is a 5-line of example: https://www.spruceid.dev/didkit/didkit-packages/javascript
    // 3> Assign/link newly created DID to `address`
    const key = didkit_wasm_1.default.generateEd25519Key();
    const did = { id: didkit_wasm_1.default.keyToDID('key', key) };
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
