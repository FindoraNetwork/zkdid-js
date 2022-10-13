import { getContentByKey, setContentByKey } from './lib/cache';
import { Base64 } from 'js-base64';
import Constants from './lib/constants';
import { CacheType, DID } from './types';
import { stringKeccak256 } from './lib/tool';
// Credential interfaces ////////////////////////////////////////////////////////////////////////////////////
// `credential.ts`

export interface ICredential {
  getDID(): DID;
  getTypeCode(): string;
  getEncrypted(): string;
  getCircuitFamily(): string;
}

// Credential of GPA score
export class GPACredential implements ICredential {
  did: DID;
  GPAScore: number;

  constructor(did: DID, gpa: number) {
    this.did = did;
    this.GPAScore = gpa;
  }
  getDID(): DID {
    return this.did;
  }
  getTypeCode(): string {
    return stringKeccak256('credential.findora.org.GPA').slice(-Constants.HashLen);
  }
  getEncrypted(): string {
    // Implementation
    // Encrypt self into a Base64 string.
    const ObjectOfthis = Object.assign(
      {
        getDID: this.getDID(),
        getTypeCode: this.getTypeCode(),
        getCircuitFamily: this.getCircuitFamily(),
      },
      this,
    );
    return Base64.encode(JSON.stringify(ObjectOfthis));
  }
  getCircuitFamily(): string {
    return Constants.CIRCUIT_FAMILY;
  }
}

// Credential of credit score
export class CreditScoreCredential implements ICredential {
  did: DID;
  creditScore: number;

  constructor(did: DID, credit: number) {
    this.did = did;
    this.creditScore = credit;
  }
  getDID(): DID {
    return this.did;
  }
  getTypeCode(): string {
    return stringKeccak256('credential.findora.org.CreditScore').slice(-Constants.HashLen);
  }
  getEncrypted(): string {
    // Implementation
    // Encrypt self into a Base64 string.
    const ObjectOfthis = Object.assign(
      {
        getDID: this.getDID(),
        getTypeCode: this.getTypeCode(),
        getCircuitFamily: this.getCircuitFamily(),
      },
      this,
    );
    return Base64.encode(JSON.stringify(ObjectOfthis));
  }
  getCircuitFamily(): string {
    return Constants.CIRCUIT_FAMILY;
  }
}

// Credential of annual income (USD)
export class AnnualIncomeCredential implements ICredential {
  did: DID;
  annualIncomeUsd: number;

  constructor(did: DID, income: number) {
    this.did = did;
    this.annualIncomeUsd = income;
  }
  getDID(): DID {
    return this.did;
  }
  getTypeCode(): string {
    return stringKeccak256('credential.findora.org.AnnualIncome').slice(-Constants.HashLen);
  }
  getEncrypted(): string {
    // Implementation
    // Encrypt self into a Base64 string.
    const ObjectOfthis = Object.assign(
      {
        getDID: this.getDID(),
        getTypeCode: this.getTypeCode(),
        getCircuitFamily: this.getCircuitFamily(),
      },
      this,
    );
    return Base64.encode(JSON.stringify(ObjectOfthis));
  }
  getCircuitFamily(): string {
    return Constants.CIRCUIT_FAMILY;
  }
}

// General ZK credential
export interface ZKCredential {
  circuitFamily: string;
  credential: string;
  commitment: string;
}

/**
 * @param did - The did
 * @param typeCode - Credential type code (e.g., '7fed71c88753dc82cd80d84e6f28c588d4c15b88')
 * @returns `true` if `did` already links to a ZKCredential or `false` otherwise
 */
export const hasZKCredential = (did: DID, typeCode: string): boolean => {
  // Implementation
  // 1> Check existence of ZKCredential in localStorage by key [did + typeCode] (e.g., 'did:key:z6MksFwai2iBGRQdai5KSFP9FsPvZPnYY2FshK2mJ7nrYwZx:7fed71c88753dc82cd80d84e6f28c588d4c15b88').
  const key = `${did.id}:${typeCode}`;
  const zkCred = getContentByKey(CacheType.ZKCredential, key);
  if (!zkCred) return false;
  return true;
};

/**
 * @param did - The did
 * @param typeCode - Credential type code (e.g., '7fed71c88753dc82cd80d84e6f28c588d4c15b88')
 * @returns The ZKCredential instance linked to `did`
 * @throws Error if ZKCredential doesn't exist
 */
export const getZKCredential = (did: DID, typeCode: string): ZKCredential => {
  // if (!hasZKCredential(did, typeCode)) throw Error("ZKCredential doesn't exist");

  // Implementation
  // 1> Get ZKCredential from localStorage by key (same key as above)
  const key = `${did.id}:${typeCode}`;
  const credential = getContentByKey(CacheType.ZKCredential, key);
  if (!credential) throw Error("ZKCredential doesn't exist");
  const zkCredStr = Base64.decode(credential);
  const zkCredObj = JSON.parse(zkCredStr);
  return {
    circuitFamily: zkCredObj.getCircuitFamily,
    credential,
    commitment: stringKeccak256(credential),
  };
};

/**
 * @remark This method converts any credential into ZKCredential and links it to `did`
 * @param did - The did
 * @param cred - The credential instance
 * @returns An instance of ZKCredential based on `cred`
 */
export const createZKCredential = (did: DID, cred: ICredential): ZKCredential => {
  // Implementation
  // 1>
  // 2> Get encrypted credential (a Base64 string) by `cred.getEncrypted()`.
  //    Real-world encryption could be done by user's encryption key (from Metamask account).
  //
  // 3> Save above string into localStorage under a proper key (e.g., did:key:z6MksFwai2iBGRQdai5KSFP9FsPvZPnYY2FshK2mJ7nrYwZx:7fed71c88753dc82cd80d84e6f28c588d4c15b88)
  //    A real-world `did` may own multiple credentials (CreditScoreCredential, GPACredential, ResidentCredential, etc.) and have them stored in IPFS (or offline),
  //    and the returning `credential` field (in ZKCredential), if stored in IPFS, can be just a link (e.g., ipfs://bafkreian2qdyjirx3yyglkc3yznyw5rliqag3g362ibotgxorieuhftyv4)
  //    that points to the encrypted credential file.
  //
  // 4> The returning `commitment` field (in ZKCredential) can just simply be a Hash (sha256) of `cred` (underlying credential object).
  //    Real-world commitment is usually published/stored, by ZKCredential issuer, in a smart contract on blockchain.

  const credential = cred.getEncrypted();
  const key = `${did.id}:${cred.getTypeCode()}`;
  setContentByKey(CacheType.ZKCredential, key, credential);
  return {
    circuitFamily: cred.getCircuitFamily(),
    credential: credential,
    commitment: stringKeccak256(credential),
  };
};
