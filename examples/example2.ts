import { randomInt } from 'crypto';

import { zkDID } from 'zkDID';
import { ethers } from 'ethers';

import { DID } from 'zkDID/dist/types';
import { stringKeccak256 } from 'zkDID/dist/lib/tool';
import { ConstraintINT_RNG, ConstraintSTR_RNG } from 'zkDID/dist/constraints';
import { createCircuit, hasCircuit, ZKCircuit } from 'zkDID/dist/circuit';
import { generateZKProof, verifyZKProof } from 'zkDID/dist/zkproof';
import { createZKCredential, getZKCredential, hasZKCredential, ICredential } from 'zkDID/dist/credential';

interface KYC_Info {
  dateOfBirth: number;
  name: string;
  country: string;
}

// A custom credential for KYC
class KYC_Credential extends ICredential {
  private info: KYC_Info

  constructor(did: DID, info: KYC_Info) {
    super(did);
    this.info = info;
  }
  static issuer(): string {
    return 'my.credential.org';
  }
  static purpose(): string {
    return stringKeccak256(`${this.issuer()}.kyc-info`);
  }
  getInfo() {
    return this.info;
  }
  getIssuer(): string {
    return KYC_Credential.issuer();
  }
  getPurpose(): string {
    return KYC_Credential.purpose();
  }
  getEncrypted(): string {
    const ObjectOfthis = {
      did: this.getDID(),
      dateOfBirth: this.info.dateOfBirth,
      name: this.info.name,
      country: this.info.country
    };

    // Base64 encoding is now REQUIRED to make proof verification working
    return btoa(JSON.stringify(ObjectOfthis));
  }
}

// Credential issuer defines a constraint for DOB check
const KYC_Born_in_the_20th_century_min = new Date('1901-01-01').getTime();
const KYC_Born_in_the_20th_century_max = new Date('2000-12-31').getTime();
const KYC_Born_in_the_20th_century = new ConstraintINT_RNG('dateOfBirth', KYC_Born_in_the_20th_century_min, KYC_Born_in_the_20th_century_max);

// Credential issuer defines a constraint for Southeast Asia country check
const KYC_Country_ASoutheast_Asia_v0001_range = [
  'Philippines', 'Vietnam', 'Laos', 'Cambodia', 'Myanmar',
  'Thailand', 'Malaysia', 'Brunei', 'Singapore', 'Indonesia',
  'Timor Leste'
];
const KYC_Country_ASoutheast_Asia_v0001 = new ConstraintSTR_RNG('country', KYC_Country_ASoutheast_Asia_v0001_range);

// Credential issuer creates a circuit (and publishes its code) based on above constraints
const purpose = KYC_Credential.purpose();
const zkCircuit = new ZKCircuit([KYC_Born_in_the_20th_century, KYC_Country_ASoutheast_Asia_v0001]);
const CIRCUIT_CODE_OF_KYC_EXAMPLE = zkCircuit.toCode();
if (false === hasCircuit(purpose, zkCircuit.toCode())) createCircuit(purpose, zkCircuit);

// Generates 10 example users and their KYC credentials (with random DOB, name and country) for testing
const UserNumber = 10;
const users = new Array(UserNumber).fill(null).map((v, i) => {
  // Generates ETH address
  const address = ethers.Wallet.createRandom().address;

  // Identity issuer creates an did and assign it to the user
  if (false === zkDID.did.hasDID(address)) zkDID.did.createDID(address);
  const did = zkDID.did.getDID(address);

  // Defines range of DOB and countries to generate random user information
  const minDOB = new Date('1801-01-01').getTime();
  const maxDOB = new Date('2022-11-04').getTime();
  const country_list = ['Philippines', 'Myanmar', 'Thailand', 'Malaysia', 'Brunei', 'Singapore', 'USA', 'UK', 'Japan', 'Germany'];

  // Generates a random user information
  const info = {
    dateOfBirth: randomInt(minDOB, maxDOB),
    name: `${(i + 10).toString(36)}`,
    country: country_list[randomInt(0, country_list.length)],
  };

  // KYC credential issuer issues a KYC credential to each user
  return {
    address,
    info,
    kyc: new KYC_Credential(did, info)
  }
});

// KYC credential issuer issues a ZK credential (based on their KYC credential) to each user
users.forEach(async (user) => {
  const did = user.kyc.getDID();
  if (false === hasZKCredential(did, purpose)) createZKCredential(user.kyc);
});

type Result = {
  [key: number]: boolean;
};

const result: Result = {};

// Verification on each example user
Promise.all(users.map(async (user, index) => {
  // User holds his/her ZK credential on hand (The real-world ZK credential can be stored offline or on IPFS).
  const did = user.kyc.getDID();
  const zkCred = getZKCredential(did, purpose);

  // User goes to verifier's (who needs to check the ZK credential) website and generates a ZKProof based on a circuit (specified by verifier)
  const zkProof = await generateZKProof(zkCred, CIRCUIT_CODE_OF_KYC_EXAMPLE);

  // Verifier checks the ZKProof to see if the user is qualified (born in 20th century AND live in Southeast Asia)
  // Note: `zkProof` probably doesn't know its owner at all. It would be better if DApp uses zkDID.zkproof.verifySignedZKProof to verify the ownership of the `zkProof`.
  const res = verifyZKProof(zkProof, user.address, purpose);

  // The verification result
  result[index] = res;
})).then(() => {
  console.log(result)
})
