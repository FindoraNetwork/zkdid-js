import React, { useEffect, useRef, useState } from "react";
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
  gender: 'Male' | 'Female' | 'unknown';
}
class KYC_Credential extends ICredential {
  private info: KYC_Info

  constructor(did: DID, info: KYC_Info) {
    super(did);
    this.info = info;
  }
  static issuer(): string {
    return 'my kyc credential';
  }
  static purpose(): string {
    return stringKeccak256(`${this.issuer()}.a-kyc-info`);
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
      country: this.info.country,
      gender: this.info.gender,
    };
    return Base64.encode(JSON.stringify(ObjectOfthis));
  }
}
const KYC_Born_in_1970_1990 = new ConstraintINT_RNG('timeOfBirth', new Date('1970-01-01').getTime(), new Date('1991-01-01').getTime());
const KYC_Born_in_1980_2000 = new ConstraintINT_RNG('timeOfBirth', new Date('1980-01-01').getTime(), new Date('2001-01-01').getTime());
const KYC_Born_in_1990_2000 = new ConstraintINT_RNG('timeOfBirth', new Date('1990-01-01').getTime(), new Date('2001-01-01').getTime());

const KYC_Country_ASoutheast_Asia_v0001_range = [
  'Philippines', 'Vietnam', 'Laos', 'Cambodia', 'Myanmar',
  'Thailand', 'Malaysia', 'Brunei', 'Singapore', 'Indonesia',
  'Timor Leste'
];
const KYC_Country_ASoutheast_Asia_v0001 = new ConstraintSTR_RNG('country', KYC_Country_ASoutheast_Asia_v0001_range);
const KYC_Country_Philippines = new ConstraintSTR_RNG('country', ['Philippines']);
const KYC_Country_USA = new ConstraintSTR_RNG('country', ['USA']);

const KYC_Gender_Male = new ConstraintSTR_RNG('gender', ['Male']);
const KYC_Gender_Female = new ConstraintSTR_RNG('gender', ['Female']);
const KYC_Gender_Known = new ConstraintSTR_RNG('gender', ['Female', 'Male']);

const purpose = KYC_Credential.purpose();

const KYC_1990_2000_Philippines_Male = new ZKCircuit([
  KYC_Born_in_1990_2000,
  KYC_Country_Philippines,
  KYC_Gender_Male
]);
const KYC_1980_1990_USA_Known = new ZKCircuit([
  KYC_Born_in_1970_1990,
  KYC_Born_in_1980_2000,
  KYC_Country_USA,
  KYC_Gender_Known
]);
const KYC_1980_2000_Southeast_Asia_v0001_Femal = new ZKCircuit([
  KYC_Born_in_1980_2000,
  KYC_Country_ASoutheast_Asia_v0001,
  KYC_Gender_Female
]);
const KYC_Femal = new ZKCircuit([
  KYC_Gender_Female
]);
const zkCircuits = [
  KYC_1990_2000_Philippines_Male,
  KYC_1980_1990_USA_Known,
  KYC_1980_2000_Southeast_Asia_v0001_Femal,
  KYC_Femal
];
zkCircuits.forEach(zkCircuit => {
  if (hasCircuit(purpose, zkCircuit.toCode())) return;
  createCircuit(purpose, zkCircuit);
});

const TestUsernumber = 40;

const Step3: React.FC = (props) => {
  const [users, _users] = useState(() => new Array(TestUsernumber).fill(null).map((v, i) => {
    const minTime = new Date('1970-01-01').getTime();
    const maxTime = new Date('2000-01-01').getTime();
    const country_list = ['Philippines', 'USA', 'none', 'Japan'];
    const gender_list: KYC_Info['gender'][] = ['Male', 'Female', 'unknown'];
    const address = ethers.Wallet.createRandom().address;
    if (false === zkDID.did.hasDID(address)) zkDID.did.createDID(address);
    const did = zkDID.did.getDID(address);
    const info = {
      timeOfBirth: randomNumber(minTime, maxTime),
      name: `${(i+10).toString(36)}`,
      country: country_list[randomNumber(0, country_list.length)],
      gender: gender_list[randomNumber(0, gender_list.length)],
    };
    return {
      address,
      info,
      kyc: new KYC_Credential(did, info),
      verifyResult: zkCircuits.map(() => null) as Array<null | boolean>
    }
  }));
  useEffect(() => {
    users.forEach(async (user, index) => {
      const did = user.kyc.getDID();
      if (false === hasZKCredential(did, purpose)) createZKCredential(user.kyc);
      const zkCred = getZKCredential(did, purpose);
      zkCircuits.forEach(async (zkCircuit, vIndex) => {
        const zkProof = await generateZKProof(zkCred, zkCircuit.toCode());
        const res = verifyZKProof(zkProof, user.address, purpose);
        _users(us => {
          const u = users[index];
          u.verifyResult[vIndex] = res;
          u.verifyResult = [...u.verifyResult];
          us[index] = {...u};
          return [...us];
        });
      });
    });
  }, []);
  const table_th = [
    'name', 'timeOfBirth', 'country', 'gender',
    '1990_2000<br/>Philippines<br/>Male',
    '1980_1990<br/>USA<br/>Known',
    '1980_2000<br/>Southeast_Asia_v0001<br/>Femal',
    'Femal'
  ];

  return <MarkdownCpt md={`
    # example 3
    ### use create credential and circuits to create proofs and verify

    |  ${table_th.join('  |  ')}  |
    |${table_th.map(() => '---').join('|')}|
    ${users.map((user, index) => {
      // const timeStr = new Date(user.info.timeOfBirth).toISOString().replace(/T(.*)/, '');
      const result = [
        user.info.name,
        new Date(user.info.timeOfBirth).toISOString().replace(/T(.*)/, ''),
        user.info.country,
        user.info.gender,
        ...zkCircuits.map((v, i) => {
          const res = String(user.verifyResult[i]);
          return res === 'false' ? `\`${res}\`` : res;
        })
      ];
      return `|${result.join('|')}|`;
    }).join('\r')}

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
        gender: 'Male' | 'Female' | 'unknown';
      }
      class KYC_Credential extends ICredential {
        private info: KYC_Info

        constructor(did: DID, info: KYC_Info) {
          super(did);
          this.info = info;
        }
        static issuer(): string {
          return 'my kyc credential';
        }
        static purpose(): string {
          return stringKeccak256(\`\${this.issuer()}.a-kyc-info\`);
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
            country: this.info.country,
            gender: this.info.gender,
          };
          return Base64.encode(JSON.stringify(ObjectOfthis));
        }
      }
      const KYC_Born_in_1970_1990 = new ConstraintINT_RNG('timeOfBirth', new Date('1970-01-01').getTime(), new Date('1991-01-01').getTime());
      const KYC_Born_in_1980_2000 = new ConstraintINT_RNG('timeOfBirth', new Date('1980-01-01').getTime(), new Date('2001-01-01').getTime());
      const KYC_Born_in_1990_2000 = new ConstraintINT_RNG('timeOfBirth', new Date('1990-01-01').getTime(), new Date('2001-01-01').getTime());

      const KYC_Country_ASoutheast_Asia_v0001_range = [
        'Philippines', 'Vietnam', 'Laos', 'Cambodia', 'Myanmar',
        'Thailand', 'Malaysia', 'Brunei', 'Singapore', 'Indonesia',
        'Timor Leste'
      ];
      const KYC_Country_ASoutheast_Asia_v0001 = new ConstraintSTR_RNG('country', KYC_Country_ASoutheast_Asia_v0001_range);
      const KYC_Country_Philippines = new ConstraintSTR_RNG('country', ['Philippines']);
      const KYC_Country_USA = new ConstraintSTR_RNG('country', ['USA']);

      const KYC_Gender_Male = new ConstraintSTR_RNG('gender', ['Male']);
      const KYC_Gender_Female = new ConstraintSTR_RNG('gender', ['Female']);
      const KYC_Gender_Known = new ConstraintSTR_RNG('gender', ['Female', 'Male']);

      const purpose = KYC_Credential.purpose();

      const KYC_1990_2000_Philippines_Male = new ZKCircuit([
        KYC_Born_in_1990_2000,
        KYC_Country_Philippines,
        KYC_Gender_Male
      ]);
      const KYC_1980_1990_USA_Known = new ZKCircuit([
        KYC_Born_in_1970_1990,
        KYC_Born_in_1980_2000,
        KYC_Country_USA,
        KYC_Gender_Known
      ]);
      const KYC_1980_2000_Southeast_Asia_v0001_Femal = new ZKCircuit([
        KYC_Born_in_1980_2000,
        KYC_Country_ASoutheast_Asia_v0001,
        KYC_Gender_Female
      ]);
      const KYC_Femal = new ZKCircuit([
        KYC_Gender_Female
      ]);
      const zkCircuits = [
        KYC_1990_2000_Philippines_Male,
        KYC_1980_1990_USA_Known,
        KYC_1980_2000_Southeast_Asia_v0001_Femal,
        KYC_Femal
      ];
      zkCircuits.forEach(zkCircuit => {
        if (hasCircuit(purpose, zkCircuit.toCode())) return;
        createCircuit(purpose, zkCircuit);
      });

      const TestUsernumber = 40;

      const [users, _users] = useState(() => new Array(TestUsernumber).fill(null).map((v, i) => {
        const minTime = new Date('1970-01-01').getTime();
        const maxTime = new Date('2000-01-01').getTime();
        const country_list = ['Philippines', 'USA', 'none', 'Japan'];
        const gender_list: KYC_Info['gender'][] = ['Male', 'Female', 'unknown'];
        const address = ethers.Wallet.createRandom().address;
        if (false === zkDID.did.hasDID(address)) zkDID.did.createDID(address);
        const did = zkDID.did.getDID(address);
        const info = {
          timeOfBirth: randomNumber(minTime, maxTime),
          name: \`\${(i+10).toString(36)}\`,
          country: country_list[randomNumber(0, country_list.length)],
          gender: gender_list[randomNumber(0, gender_list.length)],
        };
        return {
          address,
          info,
          kyc: new KYC_Credential(did, info),
          verifyResult: zkCircuits.map(() => null) as Array<null | boolean>
        }
      }));
      useEffect(() => {
        users.forEach(async (user, index) => {
          const did = user.kyc.getDID();
          if (false === hasZKCredential(did, purpose)) createZKCredential(user.kyc);
          const zkCred = getZKCredential(did, purpose);
          zkCircuits.forEach(async (zkCircuit, vIndex) => {
            const zkProof = await generateZKProof(zkCred, zkCircuit.toCode());
            const res = verifyZKProof(zkProof, user.address, purpose);
            _users(us => {
              const u = users[index];
              u.verifyResult[vIndex] = res;
              u.verifyResult = [...u.verifyResult];
              us[index] = {...u};
              return [...us];
            });
          });
        });
      }, []);
    \`\`\`
  `} />;
}

export default Step3;
