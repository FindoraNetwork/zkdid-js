import { randomInt } from 'crypto';

import {ethers} from 'ethers';

import zkDID from 'zkDID';
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
      return stringKeccak256(`${this.issuer()}.kyc-multi`);
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
        country: this.info.country,
      };
      // Base64 encoding is now REQUIRED to make proof verification working
      return btoa(JSON.stringify(ObjectOfthis));
    }
  }

  // Credential issuer defines some constraints for DOB check
  const KYC_Born_in_1970_1990 = new ConstraintINT_RNG('dateOfBirth', new Date('1970-01-01').getTime(), new Date('1991-01-01').getTime());
  const KYC_Born_in_1980_2000 = new ConstraintINT_RNG('dateOfBirth', new Date('1980-01-01').getTime(), new Date('2001-01-01').getTime());
  const KYC_Born_in_1990_2000 = new ConstraintINT_RNG('dateOfBirth', new Date('1990-01-01').getTime(), new Date('2001-01-01').getTime());

  // Credential issuer defines a constraint for Southeast Asia country check
  const KYC_Country_ASoutheast_Asia_v0001_range = [
    'Philippines', 'Vietnam', 'Laos', 'Cambodia', 'Myanmar',
    'Thailand', 'Malaysia', 'Brunei', 'Singapore', 'Indonesia',
    'Timor Leste'
  ];
  const KYC_Country_ASoutheast_Asia_v0001 = new ConstraintSTR_RNG('country', KYC_Country_ASoutheast_Asia_v0001_range);

  // Credential issuer defines 2 more constraints for ONLY Philippines and ONLY USA
  const KYC_Country_Philippines = new ConstraintSTR_RNG('country', ['Philippines']);
  const KYC_Country_USA = new ConstraintSTR_RNG('country', ['USA']);

  // Credential issuer create multiple circuits (and publishes its code) based on different constraints
  //
  // > 1. The circuit requires DOB of 1990s and country of Philippines
  const KYC_1990_2000_Philippines = new ZKCircuit([
    KYC_Born_in_1990_2000,
    KYC_Country_Philippines,
  ]);

  // > 2. The circuit requires DOB of 1980s and country of USA
  const KYC_1980_1990_USA = new ZKCircuit([
    KYC_Born_in_1970_1990,
    KYC_Born_in_1980_2000,
    KYC_Country_USA,
  ]);

  // > 3. The circuit requires Southeast Asia country
  const KYC_Southeast_Asia_v0001 = new ZKCircuit([
    KYC_Country_ASoutheast_Asia_v0001,
  ]);

  const zkCircuits = [
    KYC_1990_2000_Philippines,
    KYC_1980_1990_USA,
    KYC_Southeast_Asia_v0001,
  ];

  // circuit creation
  const purpose = KYC_Credential.purpose();
  zkCircuits.forEach(zkCircuit => {
    if (hasCircuit(purpose, zkCircuit.toCode())) return;
    createCircuit(purpose, zkCircuit);
  });

  // Generates 40 example users and their KYC credentials (with random DOB, name and country) for testing
  const UserNumber = 40;
  const users = new Array(UserNumber).fill(null).map((v, i) => {
    // Generates ETH address
    const address = ethers.Wallet.createRandom().address;

    // Identity issuer creates an did and assign it to the user
    if (false === zkDID.did.hasDID(address)) zkDID.did.createDID(address);
    const did = zkDID.did.getDID(address);

    // Defines range of DOB and countries to generate random user information
    const minDOB = new Date('1970-01-01').getTime();
    const maxDOB = new Date('2000-01-01').getTime();
    const country_list = ['Philippines', 'USA', 'UK', 'Japan'];

    // Generates a random user information
    const info = {
      dateOfBirth: randomInt(minDOB, maxDOB),
      name: `${(i+10).toString(36)}`,
      country: country_list[randomInt(0, country_list.length)],
    };

    // KYC credential issuer issues a KYC credential to each user
    return {
      address,
      info,
      kyc: new KYC_Credential(did, info),
      verifyResult: zkCircuits.map(() => null) as Array<null | boolean>
    }
  });

    // Verification on each example user
Promise.all(users.map(async (user, index) => {
    // User holds his/her ZK credential on hand (The real-world ZK credential can be stored offline or on IPFS).
    const did = user.kyc.getDID();

    if (hasZKCredential(did, purpose)) {
        var zkCred = getZKCredential(did, purpose);
    } else {
        zkCred = createZKCredential(user.kyc);
    }

    // Verification on each circuit
    await Promise.all(zkCircuits.map(async (zkCircuit, vIndex) => {
      // User goes to verifier's (who needs to check the ZK credential) website and generates a ZKProof based on a circuit (specified by verifier)
      const zkProof = await generateZKProof(zkCred, zkCircuit.toCode());

      // Verifier checks the ZKProof to see if the user is qualified (based on each circuit)
      // Note: `zkProof` probably doesn't know its owner at all. It would be better if DApp uses zkDID.zkproof.verifySignedZKProof to verify the ownership of the `zkProof`.
      const res = verifyZKProof(zkProof, user.address, purpose);

      // The verification result
      user.verifyResult[vIndex] = res;
    }));

})).then(()=>{
    console.log("Done", users.map( u => u.verifyResult))
  }).catch(e=> console.error(e));