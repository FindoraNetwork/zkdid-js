import React, { Fragment, useEffect, useRef, useState } from "react";
import zkDID from '@findora/zkdid-js';
import * as ethers from 'ethers';
import MarkdownCpt from "./md";
import { Base64 } from "js-base64";
import { randomNumber } from "_src/utils/random";
import { createZKCredential, getZKCredential, hasZKCredential, ICredential } from "@findora/zkdid-js/dist/credential";
import { DID } from "@findora/zkdid-js/dist/types";
import { stringKeccak256 } from "@findora/zkdid-js/dist/lib/tool";
import { ConstraintINT_RNG, ConstraintSTR_RNG } from "@findora/zkdid-js/dist/constraints";
import { createCircuit, hasCircuit, ZKCircuit } from "@findora/zkdid-js/dist/circuit";
import { generateZKProof, verifyZKProof } from "@findora/zkdid-js/dist/zkproof";

interface KYC_Info {
  dateOfBirth: number;
  name: string;
  country: string;
}
class KYC_Credential extends ICredential {
  private info: KYC_Info

  constructor(did: DID, info: KYC_Info) {
    super(did);
    this.info = info;
  }
  static issuer(): string {
    return 'my credential';
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
    return Base64.encode(JSON.stringify(ObjectOfthis));
  }
}
const KYC_Born_in_the_20th_century_min = new Date('1901-01-01').getTime();
const KYC_Born_in_the_20th_century_max = new Date('2000-12-31').getTime();
const KYC_Born_in_the_20th_century = new ConstraintINT_RNG('dateOfBirth', KYC_Born_in_the_20th_century_min, KYC_Born_in_the_20th_century_max);

const KYC_Country_ASoutheast_Asia_v0001_range = [
  'Philippines', 'Vietnam', 'Laos', 'Cambodia', 'Myanmar',
  'Thailand', 'Malaysia', 'Brunei', 'Singapore', 'Indonesia',
  'Timor Leste'
];
const KYC_Country_ASoutheast_Asia_v0001 = new ConstraintSTR_RNG('country', KYC_Country_ASoutheast_Asia_v0001_range);

const UserNumber = 10;
const Step2: React.FC = (props) => {
  console.log('step2');
  const [users] = useState(() => new Array(UserNumber).fill(null).map((v, i) => {
    const minDOB = new Date('1851-01-01').getTime();
    const maxDOB = new Date('2050-12-31').getTime();
    const country_list = ['Philippines', 'Myanmar', 'Thailand', 'Malaysia', 'Brunei', 'Singapore', 'USA', 'UK', 'Japan', 'Germany'];

    // const address = ethers.Wallet.createRandom().address;
    const address = new ethers.Wallet(ethers.utils.randomBytes(32)).address;

    if (false === zkDID.did.hasDID(address)) zkDID.did.createDID(address);
    const did = zkDID.did.getDID(address);
    const info = {
      dateOfBirth: randomNumber(minDOB, maxDOB),
      name: `${(i+10).toString(36)}`,
      country: country_list[randomNumber(0, country_list.length)],
    };
    return {
      address,
      info,
      kyc: new KYC_Credential(did, info)
    }
  }));
  const [verify, _verify] = useState<Array<null | boolean>>(() => new Array(UserNumber).fill(null));
  useEffect(() => {
    _verify(new Array(UserNumber).fill(null));
    update();
  }, []);

  async function update() {
    // create circuit
    const purpose = KYC_Credential.purpose();
    const zkCircuit = new ZKCircuit([KYC_Born_in_the_20th_century, KYC_Country_ASoutheast_Asia_v0001]);
    const code = zkCircuit.toCode();
    if (false === hasCircuit(purpose, zkCircuit.toCode())) createCircuit(purpose, zkCircuit);
    // const circuit = getCircuit(purpose, zkCircuit.toCode());

    users.forEach(async (user, index) => {
      const did = user.kyc.getDID();
      if (false === hasZKCredential(did, purpose)) createZKCredential(user.kyc);
      const zkCred = getZKCredential(did, purpose);
      const zkProof = await generateZKProof(zkCred, code);
      const res = verifyZKProof(zkProof, user.address, purpose);
      _verify(v => (v[index] = res, [...v]));
    });
  }

  return (
    <MarkdownCpt md={`
      # example 2
      ### Use custom credential and circuit to create proof and verify

      \`\`\`ts
        import zkDID from 'zkDID';
        import ethers from 'ethers';
        import { randomNumber } from "_src/utils/random";
        import { createZKCredential, getZKCredential, hasZKCredential, ICredential } from "zkDID/credential";
        import { DID } from "zkDID/types";
        import { stringKeccak256 } from "zkDID/lib/tool";
        import { ConstraintINT_RNG, ConstraintSTR_RNG } from "zkDID/constraints";
        import { createCircuit, hasCircuit, ZKCircuit } from "zkDID/circuit";
        import { generateZKProof, verifyZKProof } from "zkDID/zkproof";

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
            return stringKeccak256(\`\${this.issuer()}.kyc-info\`);
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
            return Base64.encode(JSON.stringify(ObjectOfthis));
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
            dateOfBirth: randomNumber(minDOB, maxDOB),
            name: \`\${(i+10).toString(36)}\`,
            country: country_list[randomNumber(0, country_list.length)],
          };

          // KYC credential issuer issues a KYC credential to each user
          return {
            address,
            info,
            kyc: new KYC_Credential(did, info)
          }
        });

        // KYC credential issuer issues a ZK credential (based on their KYC credential) to each user
        users.forEach(async (user, index) => {
          const did = user.kyc.getDID();
          if (false === hasZKCredential(did, purpose)) createZKCredential(user.kyc);
        });

        // Verification on each example user
        users.forEach(async (user, index) => {
          // User holds his/her ZK credential on hand (The real-world ZK credential can be stored offline or on IPFS).
          const did = user.kyc.getDID();
          const zkCred = getZKCredential(did, purpose);

          // User goes to verifier's (who needs to check the ZK credential) website and generates a ZKProof based on a circuit (specified by verifier)
          const zkProof = await generateZKProof(zkCred, CIRCUIT_CODE_OF_KYC_EXAMPLE);

          // Verifier checks the ZKProof to see if the user is qualified (born in 20th century AND live in Southeast Asia)
          // Note: \`zkProof\` probably doesn't know its owner at all. It would be better if DApp uses zkDID.zkproof.verifySignedZKProof to verify the ownership of the \`zkProof\`.
          const res = verifyZKProof(zkProof, user.address, purpose);

          // The verification result
          result[index] = res;
        });

      \`\`\`

      | name  | dateOfBirth  | country  | result  |
      |----|----|----|----|
      ${users.map((user, index) => {
        const result = verify[index] === null ? 'loading...' : String(verify[index]);
        const timeStr = new Date(user.info.dateOfBirth).toISOString().replace(/T(.*)/, '');
        const timeMatch = user.info.dateOfBirth > KYC_Born_in_the_20th_century_min && user.info.dateOfBirth < KYC_Born_in_the_20th_century_max;
        const countryMatch = KYC_Country_ASoutheast_Asia_v0001_range.includes(user.info.country);

        const timeShow = timeMatch ? `${timeStr}` : `\`${timeStr}\``;
        const countryShow = countryMatch ? `${user.info.country}` : `\`${user.info.country}\``;
        const resultShow = result === 'false' ? `\`${result}\`` : result;

        return `| ${user.info.name}  | ${timeShow}  | ${countryShow}  | ${resultShow}  |`;
      }).join('\r')}
    `} />
  );
}

export default Step2;
