import React, { Fragment, useEffect, useRef, useState } from "react";
import zkDID from '../zkDID';
import * as ethers from 'ethers';
import MarkdownCpt from "./md";
import { Base64 } from "js-base64";
import { randomNumber } from "_src/utils/random";
import { createZKCredential, getZKCredential, hasZKCredential, ICredential } from "_src/zkDID/credential";
import { DID } from "_src/zkDID/types";
import { stringKeccak256 } from "_src/zkDID/lib/tool";
import { ConstraintINT_RNG, ConstraintSTR_RNG } from "_src/zkDID/constraints";
import { createCircuit, hasCircuit, ZKCircuit } from "_src/zkDID/circuit";
import { generateZKProof, verifyZKProof } from "_src/zkDID/zkproof";

interface KYC_Info {
  timeOfBirth: number;
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
      timeOfBirth: this.info.timeOfBirth,
      name: this.info.name,
      country: this.info.country
    };
    return Base64.encode(JSON.stringify(ObjectOfthis));
  }
}
const KYC_Born_in_the_20th_century_min = new Date('1901-01-01').getTime();
const KYC_Born_in_the_20th_century_max = new Date('2000-12-31').getTime();
const KYC_Born_in_the_20th_century = new ConstraintINT_RNG('timeOfBirth', KYC_Born_in_the_20th_century_min, KYC_Born_in_the_20th_century_max);

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
    const minTime = new Date('1851-01-01').getTime();
    const maxTime = new Date('2050-12-31').getTime();
    const country_list = ['Philippines', 'Myanmar', 'Thailand', 'Malaysia', 'Brunei', 'Singapore', 'USA', 'none', 'Japan', 'Germany'];

    // const address = ethers.Wallet.createRandom().address;
    const address = new ethers.Wallet(ethers.utils.randomBytes(32)).address;

    if (false === zkDID.did.hasDID(address)) zkDID.did.createDID(address);
    const did = zkDID.did.getDID(address);
    const info = {
      timeOfBirth: randomNumber(minTime, maxTime),
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
      ### use create credential and circuit to create proof and verify

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
          timeOfBirth: number;
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
              timeOfBirth: this.info.timeOfBirth,
              name: this.info.name,
              country: this.info.country
            };
            return Base64.encode(JSON.stringify(ObjectOfthis));
          }
        }
        const KYC_Born_in_the_20th_century_min = new Date('1901-01-01').getTime();
        const KYC_Born_in_the_20th_century_max = new Date('2000-12-31').getTime();
        const KYC_Born_in_the_20th_century = new ConstraintINT_RNG('timeOfBirth', KYC_Born_in_the_20th_century_min, KYC_Born_in_the_20th_century_max);

        const KYC_Country_ASoutheast_Asia_v0001_range = [
          'Philippines', 'Vietnam', 'Laos', 'Cambodia', 'Myanmar',
          'Thailand', 'Malaysia', 'Brunei', 'Singapore', 'Indonesia',
          'Timor Leste'
        ];
        const KYC_Country_ASoutheast_Asia_v0001 = new ConstraintSTR_RNG('country', KYC_Country_ASoutheast_Asia_v0001_range);

        const UserNumber = 10;

        const users = new Array(UserNumber).fill(null).map((v, i) => {
          const minTime = new Date('1801-01-01').getTime();
          const maxTime = new Date('2100-12-31').getTime();
          const country_list = ['Philippines', 'Myanmar', 'Thailand', 'Malaysia', 'Brunei', 'Singapore', 'USA', 'none', 'Japan', 'Germany'];

          const address = ethers.Wallet.createRandom().address;
          if (false === zkDID.did.hasDID(address)) zkDID.did.createDID(address);
          const did = zkDID.did.getDID(address);
          const info = {
            timeOfBirth: randomNumber(minTime, maxTime),
            name: \`\${(i+10).toString(36)}\`,
            country: country_list[randomNumber(0, country_list.length)],
          };
          return {
            address,
            info,
            kyc: new KYC_Credential(did, info)
          }
        });

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
          result[index] = res;
        });

      \`\`\`

      | name  | timeOfBirth  | country  | result  |
      |----|----|----|----|
      ${users.map((user, index) => {
        const result = verify[index] === null ? 'loading...' : String(verify[index]);
        const timeStr = new Date(user.info.timeOfBirth).toISOString().replace(/T(.*)/, '');
        const timeMatch = user.info.timeOfBirth > KYC_Born_in_the_20th_century_min && user.info.timeOfBirth < KYC_Born_in_the_20th_century_max;
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
