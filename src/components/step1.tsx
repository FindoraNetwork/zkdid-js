import React, { useEffect, useRef, useState } from "react";
import zkDID from '../zkDID';
import * as ethers from 'ethers';
import MarkdownCpt from "./md";

const Step1: React.FC = () => {
  const [address] = useState(() => ethers.Wallet.createRandom().address);
  const [did, _did] = useState(() => {
    const has = zkDID.did.hasDID(address);
    if (!has) zkDID.did.createDID(address);
    return zkDID.did.getDID(address);
  });
  const [verifyZKProofRes, _verifyZKProofRes] = useState<boolean | null>(null);

  useEffect(() => {
    _verifyZKProofRes(null);
    update();
  }, [did]);

  async function update() {
    const purpose = zkDID.credential.GPACredential.purpose();
    const zkCircuit = new zkDID.circuit.ZKCircuit([zkDID.constraints.CONSTRAINT_GPA_35]);
    const code = zkCircuit.toCode();
    // const circuit = getCircuit(purpose, code);
    const gpa40 = new zkDID.credential.GPACredential(did, 4.0);

    if (false === zkDID.credential.hasZKCredential(did, purpose)) zkDID.credential.createZKCredential(gpa40);
    const zkCred = zkDID.credential.getZKCredential(did, purpose);
    const zkProof = await zkDID.zkproof.generateZKProof(zkCred, code);
    const res = zkDID.zkproof.verifyZKProof(zkProof, address, purpose);
    _verifyZKProofRes(res);
  }

  return <MarkdownCpt md={`
    # example 1
    ### use predefined credential and circuit to create proof and verify

    **address**: ${address}

    **did**: ${did.id}

    \`\`\`ts
      import zkDID from 'zkDID';
      import ethers from 'ethers';

      const address = ethers.Wallet.createRandom().address;
      const did = (() => {
        const has = zkDID.did.hasDID(address);
        if (!has) zkDID.did.createDID(address);
        return zkDID.did.getDID(address);
      })();
      const gpa40 = new zkDID.credential.GPACredential(did, 4.0);
      const purpose = zkDID.credential.GPACredential.purpose();
      const zkCircuit = new zkDID.circuit.ZKCircuit([zkDID.constraints.CONSTRAINT_GPA_35]);

      async function verify() {
        const code = zkCircuit.toCode();
        // const circuit = getCircuit(purpose, code);

        if (false === zkDID.credential.hasZKCredential(did, purpose)) zkDID.credential.createZKCredential(gpa40);
        const zkCred = zkDID.credential.getZKCredential(did, purpose);
        const zkProof = await zkDID.zkproof.generateZKProof(zkCred, code);
        const res = zkDID.zkproof.verifyZKProof(zkProof, address, purpose);
        // res: ${verifyZKProofRes}
      }
      verify();
    \`\`\`
  `} />;
}

export default Step1;
