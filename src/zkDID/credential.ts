import { getContentByKey, setContentByKey } from './lib/cache';
import { Base64 } from 'js-base64';
import Constants from './lib/constants';
import { CacheType, DID } from './types';
import { stringKeccak256 } from './lib/tool';

// Credential interfaces
export abstract class ICredential {
  private did: DID;
  constructor(did: DID) {
    this.did = did;
  }
  getDID(): DID {
    return this.did;
  }
  getCommitment() {
    return stringKeccak256(this.getEncrypted());
  }
  abstract getPurpose(): string;
  abstract getEncrypted(): string;
}

// ZK credential interface
export interface ZKCredential {
  did: DID;
  purpose: string;
  credential: string;
  commitment: string;
}

/**
 * @param did - The did
 * @param purpose - Credential purpose code (e.g., '7fed71c88753dc82cd80d84e6f28c588d4c15b88')
 * @returns `true` if `did` already links to a ZKCredential or `false` otherwise
 */
export const hasZKCredential = (did: DID, purpose: string): boolean => {
  // Implementation
  // 1> Check existence of ZKCredential in localStorage by key [did + purpose] (e.g., 'did:key:z6MksFwai2iBGRQdai5KSFP9FsPvZPnYY2FshK2mJ7nrYwZx:7fed71c88753dc82cd80d84e6f28c588d4c15b88').
  const key = `${did.id}:${purpose}`;
  const zkCred = getContentByKey(CacheType.ZKCredential, key);
  if (!zkCred) return false;
  return true;
};

/**
 * @param did - The did
 * @param purpose - Credential purpose code (e.g., '7fed71c88753dc82cd80d84e6f28c588d4c15b88')
 * @returns The ZKCredential instance linked to `did`
 * @throws Error if ZKCredential doesn't exist
 */
export const getZKCredential = (did: DID, purpose: string): ZKCredential => {
  // Implementation
  // 1> Get ZKCredential from localStorage by key (same key as above)
  const key = `${did.id}:${purpose}`;
  const credStr = getContentByKey(CacheType.ZKCredential, key);
  if (!credStr) throw Error("ZKCredential doesn't exist");
  const zkCred: ZKCredential = JSON.parse(credStr);
  return zkCred;
};

/**
 * @remark This method converts any credential into a ZKCredential instance and links it to `did`
 *         The contents in `cred` is always trusted by API for now.
 * @param cred - The credential instance
 * @returns The ZKCredential instance
 */
export const createZKCredential = (cred: ICredential): ZKCredential => {
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
  const zkCred: ZKCredential = {
    did,
    purpose: cred.getPurpose(),
    credential: cred.getEncrypted(),
    commitment: cred.getCommitment(),
  };
  // serialize and save zkCred
  setContentByKey(CacheType.ZKCredential, key, JSON.stringify(zkCred));
  return zkCred;
};

// A predefined credential of GPA score
export class GPACredential extends ICredential {
  private GPAScore: number;
  constructor(did: DID, gpa: number) {
    super(did);
    this.GPAScore = gpa;
  }
  static issuer(): string {
    return 'credential.findora.org';
  }
  static purpose(): string {
    return stringKeccak256(`${GPACredential.issuer()}.GPA`).slice(-Constants.HashLen);
  }
  getGPAScore() {
    return this.GPAScore;
  }
  getIssuer(): string {
    return GPACredential.issuer();
  }
  getPurpose(): string {
    return GPACredential.purpose();
  }
  getEncrypted(): string {
    // Implementation
    // Encrypt self into a Base64 string.
    const ObjectOfthis = {
      did: this.getDID(),
      GPAScore: this.getGPAScore(),
    };
    return Base64.encode(JSON.stringify(ObjectOfthis));
  }
}

// A predefined credential of credit score
export class CreditScoreCredential extends ICredential {
  private creditScore: number;
  constructor(did: DID, credit: number) {
    super(did);
    this.creditScore = credit;
  }
  static issuer(): string {
    return 'credential.findora.org';
  }
  static purpose(): string {
    return stringKeccak256(`${CreditScoreCredential.issuer()}.CreditScore`).slice(-Constants.HashLen);
  }
  getCreditScore() {
    return this.creditScore;
  }
  getIssuer(): string {
    return CreditScoreCredential.issuer();
  }
  getPurpose(): string {
    return CreditScoreCredential.purpose();
  }
  getEncrypted(): string {
    // Implementation
    // Encrypt self into a Base64 string.
    const ObjectOfthis = {
      did: this.getDID(),
      creditScore: this.getCreditScore(),
    };
    return Base64.encode(JSON.stringify(ObjectOfthis));
  }
}

// A predefined credential of annual income (USD)
export class AnnualIncomeCredential extends ICredential {
  private annualIncomeUsd: number;
  constructor(did: DID, income: number) {
    super(did);
    this.annualIncomeUsd = income;
  }
  static issuer(): string {
    return 'credential.findora.org';
  }
  static purpose(): string {
    return stringKeccak256(`${AnnualIncomeCredential.issuer()}.AnnualIncome`).slice(-Constants.HashLen);
  }
  getAnnualIncomeUsd() {
    return this.annualIncomeUsd;
  }
  getIssuer(): string {
    return CreditScoreCredential.issuer();
  }
  getPurpose(): string {
    return AnnualIncomeCredential.purpose();
  }
  getEncrypted(): string {
    // Implementation
    // Encrypt self into a Base64 string.
    const ObjectOfthis = {
      did: this.getDID(),
      creditScore: this.getAnnualIncomeUsd(),
    };
    return Base64.encode(JSON.stringify(ObjectOfthis));
  }
}
