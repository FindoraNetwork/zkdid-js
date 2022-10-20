"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnualIncomeCredential = exports.CreditScoreCredential = exports.GPACredential = exports.createZKCredential = exports.getZKCredential = exports.hasZKCredential = exports.ICredential = void 0;
const cache_1 = require("./lib/cache");
const js_base64_1 = require("js-base64");
const constants_1 = __importDefault(require("./lib/constants"));
const types_1 = require("./types");
const tool_1 = require("./lib/tool");
// Credential interfaces
class ICredential {
    constructor(did) {
        this.did = did;
    }
    getDID() {
        return this.did;
    }
    getCommitment() {
        return (0, tool_1.stringKeccak256)(this.getEncrypted());
    }
}
exports.ICredential = ICredential;
/**
 * @param did - The did
 * @param purpose - Credential purpose code (e.g., '7fed71c88753dc82cd80d84e6f28c588d4c15b88')
 * @returns `true` if `did` already links to a ZKCredential or `false` otherwise
 */
const hasZKCredential = (did, purpose) => {
    // Implementation
    // 1> Check existence of ZKCredential in localStorage by key [did + purpose] (e.g., 'did:key:z6MksFwai2iBGRQdai5KSFP9FsPvZPnYY2FshK2mJ7nrYwZx:7fed71c88753dc82cd80d84e6f28c588d4c15b88').
    const key = `${did.id}:${purpose}`;
    const zkCred = (0, cache_1.getContentByKey)(types_1.CacheType.ZKCredential, key);
    if (!zkCred)
        return false;
    return true;
};
exports.hasZKCredential = hasZKCredential;
/**
 * @param did - The did
 * @param purpose - Credential purpose code (e.g., '7fed71c88753dc82cd80d84e6f28c588d4c15b88')
 * @returns The ZKCredential instance linked to `did`
 * @throws Error if ZKCredential doesn't exist
 */
const getZKCredential = (did, purpose) => {
    // Implementation
    // 1> Get ZKCredential from localStorage by key (same key as above)
    const key = `${did.id}:${purpose}`;
    const credStr = (0, cache_1.getContentByKey)(types_1.CacheType.ZKCredential, key);
    if (!credStr)
        throw Error("ZKCredential doesn't exist");
    const zkCred = JSON.parse(credStr);
    return zkCred;
};
exports.getZKCredential = getZKCredential;
/**
 * @remark This method converts any credential into a ZKCredential instance and links it to `did`
 *         The contents in `cred` is always trusted by API for now.
 * @param cred - The credential instance
 * @returns The ZKCredential instance
 */
const createZKCredential = (cred) => {
    // Implementation
    //
    // 1> Get encrypted credential (a Base64 string) by `cred.getEncrypted()`.
    //    Real-world encryption could be done by user's encryption key (from Metamask account).
    //
    // 2> Save below ZKCredential into localStorage (as string) under a proper key (e.g., did:key:z6MksFwai2iBGRQdai5KSFP9FsPvZPnYY2FshK2mJ7nrYwZx:7fed71c88753dc82cd80d84e6f28c588d4c15b88)
    //    A real-world `did` may own multiple ZK credentials (CreditScoreCredential, GPACredential, ResidentCredential, etc.) represented by on-chain NFTs.
    //    If stored as an NFT, the key may look like: "0x7fed71c88753dc82cd80d84e6f28c588d4c15b88:16" and the NFT's metadata may points to the encrypted credential on IPFS.
    /*
          const zkCred: ZKCredential =
          {
            did,
            purpose: cred.getPurpose(),
            credential: cred.getEncrypted(),
            commitment: cred.getCommitment(),
          };
    */
    // 3> The `commitment` field (in above ZKCredential) can just simply be a Hash (sha256) of `cred` (underlying credential object).
    //    Real-world commitment is usually published/stored, by ZKCredential issuer, in a smart contract on blockchain.
    const did = cred.getDID();
    const key = `${did.id}:${cred.getPurpose()}`;
    const zkCred = {
        did,
        purpose: cred.getPurpose(),
        credential: cred.getEncrypted(),
        commitment: cred.getCommitment(),
    };
    // serialize and save zkCred
    (0, cache_1.setContentByKey)(types_1.CacheType.ZKCredential, key, JSON.stringify(zkCred));
    return zkCred;
};
exports.createZKCredential = createZKCredential;
// A predefined credential of GPA score
class GPACredential extends ICredential {
    constructor(did, gpa) {
        super(did);
        this.GPAScore = gpa;
    }
    static issuer() {
        return 'credential.findora.org';
    }
    static purpose() {
        return (0, tool_1.stringKeccak256)(`${GPACredential.issuer()}.GPA`).slice(-constants_1.default.HashLen);
    }
    getGPAScore() {
        return this.GPAScore;
    }
    getIssuer() {
        return GPACredential.issuer();
    }
    getPurpose() {
        return GPACredential.purpose();
    }
    getEncrypted() {
        // Implementation
        // Encrypt self into a Base64 string.
        const ObjectOfthis = {
            did: this.getDID(),
            GPAScore: this.getGPAScore(),
        };
        return js_base64_1.Base64.encode(JSON.stringify(ObjectOfthis));
    }
}
exports.GPACredential = GPACredential;
// A predefined credential of credit score
class CreditScoreCredential extends ICredential {
    constructor(did, credit) {
        super(did);
        this.creditScore = credit;
    }
    static issuer() {
        return 'credential.findora.org';
    }
    static purpose() {
        return (0, tool_1.stringKeccak256)(`${CreditScoreCredential.issuer()}.CreditScore`).slice(-constants_1.default.HashLen);
    }
    getCreditScore() {
        return this.creditScore;
    }
    getIssuer() {
        return CreditScoreCredential.issuer();
    }
    getPurpose() {
        return CreditScoreCredential.purpose();
    }
    getEncrypted() {
        // Implementation
        // Encrypt self into a Base64 string.
        const ObjectOfthis = {
            did: this.getDID(),
            creditScore: this.getCreditScore(),
        };
        return js_base64_1.Base64.encode(JSON.stringify(ObjectOfthis));
    }
}
exports.CreditScoreCredential = CreditScoreCredential;
// A predefined credential of annual income (USD)
class AnnualIncomeCredential extends ICredential {
    constructor(did, income) {
        super(did);
        this.annualIncomeUsd = income;
    }
    static issuer() {
        return 'credential.findora.org';
    }
    static purpose() {
        return (0, tool_1.stringKeccak256)(`${AnnualIncomeCredential.issuer()}.AnnualIncome`).slice(-constants_1.default.HashLen);
    }
    getAnnualIncomeUsd() {
        return this.annualIncomeUsd;
    }
    getIssuer() {
        return CreditScoreCredential.issuer();
    }
    getPurpose() {
        return AnnualIncomeCredential.purpose();
    }
    getEncrypted() {
        // Implementation
        // Encrypt self into a Base64 string.
        const ObjectOfthis = {
            did: this.getDID(),
            creditScore: this.getAnnualIncomeUsd(),
        };
        return js_base64_1.Base64.encode(JSON.stringify(ObjectOfthis));
    }
}
exports.AnnualIncomeCredential = AnnualIncomeCredential;
