import { keccak256 } from '@ethersproject/keccak256';
import { getContentByKey, setContentByKey } from './lib/cache';
import DIDKit from '@spruceid/didkit';
import { Base64 } from 'js-base64';
import { getZKCredential, ZKCredential } from './credential';
const HashLen = 40;

// ZKP interfaces ///////////////////////////////////////////////////////////////////////////////////////////
// `zkproof.ts`

export interface ZKCredentialProof {
  circuit: string; // e.g. '{$CIRCUIT_KEY_NLT30}'
  zkproof: string;
  commitment: string;
}

/**
 * @param zkCred - An instance of ZKCredential
 * @param family - The circuit family
 * @param code - The circuit code
 * @returns An instance of ZKCredentialProof
 */
export const generateZKProof = (zkCred: ZKCredential, family: string, code: string): ZKCredentialProof => {
  // Implementation
  // 1> Fetch credential data (in Base64) from localStorage by `zkCred.credential` and decode it.
  //    Real-world proof generation needs actual credential data (the values) as an input. Since we're faking out proof generation, we
  //    can just do the decoding work and stop.
  //
  // 2> Calculate returning `circuit` field by concatenating `family` and `code`. (e.g., `{$CIRCUIT_KEY_NLT30}`)
  //
  // 3> Create an instance of `ZKCredentialProof` based on params passed in.
  //    Put fetched credential data (in Base64), to field `zkproof` and pretend that it's well encrypted (so verifier can't see/decode).
  //
  // 4> Real-world proof generation is a time-consuming algorithm. For simulation, we can just randomly sleep 2~5 (find out) seconds in this API.

  const cred = JSON.parse(Base64.decode(zkCred.credential));
  return {
    circuit: '{$CIRCUIT_KEY_NLT30}',
    zkproof: 'the credential data, in Base64, fetched from localStorage',
    commitment: zkCred.commitment,
  };
};

/**
 * @param zkProof - An instance of ZKCredentialProof
 * @param zkCred - An instance of ZKCredential
 * @returns Result of proof verification
 */
export const verifyZKProof = (zkProof: ZKCredentialProof, zkCred: ZKCredential): boolean => {
  // Implementation
  // 1> Verifier compares the fields (`circuit` and `commitment`) in `zkProof` and `zkCred` to make sure they match.
  //    Throw Error("proof not matching the zkCred.circuitFamily") if detected.
  //    Throw Error("proof not matching the zkCred.commitment") if detected.
  //
  // 2> Run proof verification algorithm. To simulate, we just check the circuit against `zkProof` in a transparent way.
  //    step-1: Decode `zkProof.zkproof` with Base64. (The verifier pretends that he can't see/decode the actual values)
  //    step-2  Fetch (and deserialize) circuit (`ZKCircuitNumberNLT` object) from localStorage by `zkProof.circuit`
  //    step-3: Compare decoded values aginst deserialized circuit (`ZKCircuitNumberNLT` object)
  //            E.g., Do the comparasion of `decoded_GPA >= circuit.target`
  //
  //    step-3: Return verification result as boolean.
  return true;
};
