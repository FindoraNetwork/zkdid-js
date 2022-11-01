import React, { Fragment, useEffect, useRef, useState } from "react";
import zkDID from '@findora/zkdid-js';
import * as ethers from 'ethers';
import MarkdownCpt from "./md";

const Step1: React.FC = () => {
  console.log('step1');
  const [address] = useState(() => ethers.Wallet.createRandom().address);
  const [did, _did] = useState(() => {
    const has = zkDID.did.hasDID(address);
    if (!has) zkDID.did.createDID(address);
    return zkDID.did.getDID(address);
  });

  useEffect(() => {
    update();
  }, [did]);

  async function update() {
    const purpose = zkDID.credential.GPACredential.purpose();
    const gpa40 = new zkDID.credential.GPACredential(did, 4.0);

    if (false === zkDID.credential.hasZKCredential(did, purpose)) zkDID.credential.createZKCredential(gpa40);
    const zkCred = zkDID.credential.getZKCredential(did, purpose);
    const zkProof = await zkDID.zkproof.generateZKProof(zkCred, zkDID.circuit.CODE_GPA_35);
    const res = zkDID.zkproof.verifyZKProof(zkProof, address, purpose);
    console.log('example 1, verifyZKProof:', res);
  }

  return (
    <MarkdownCpt md={`
      # example 1
      ### Use predefined credential and circuit to create proof and verify

      **Example address**: ${address}

      **Example did**: ${did.id}

      \`\`\`ts
        import zkDID from 'zkDID';
        import ethers from 'ethers';

        // User generates an ETH address
        const address = ethers.Wallet.createRandom().address;

        // Identity issuer creates an did and assign it to the user
        const did = (() => {
          const has = zkDID.did.hasDID(address);
          if (!has) zkDID.did.createDID(address);
          return zkDID.did.getDID(address);
        })();

        // Credential issuer (e.g. Harvard) issues a GPA credential and a corresponding ZK credential to user (e.g., student)
        const gpa40 = new zkDID.credential.GPACredential(did, 4.0);
        const purpose = zkDID.credential.GPACredential.purpose();
        if (false === zkDID.credential.hasZKCredential(did, purpose)) zkDID.credential.createZKCredential(gpa40);

        // Verification
        async function verify() {
          // User holds his/her ZK credential on hand (The real-world ZK credential can be stored offline or on IPFS).
          const zkCred = zkDID.credential.getZKCredential(did, purpose);

          // User goes to verifier's (who needs to check the ZK credential) website and generates a ZKProof based on a circuit (specified by verifier)
          const zkProof = await zkDID.zkproof.generateZKProof(zkCred, zkDID.circuit.CODE_GPA_35);

          // Verifier checks the ZKProof to see if the user is qualified (GPA >= 3.5)
          // Note: \`zkProof\` probably doesn't know its owner at all. It would be better if DApp uses zkDID.zkproof.verifySignedZKProof to verify the ownership of the \`zkProof\`.
          const res = zkDID.zkproof.verifyZKProof(zkProof, address, purpose);
          // res: true
        }
        verify();
      \`\`\`
    `} />
  );
}

export default Step1;
