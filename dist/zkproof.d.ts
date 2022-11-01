import { ZKCredential } from './credential';
export interface ZKProof {
    code: string;
    proof: string;
    commitment: string;
}
export interface SignedZKProof {
    body: ZKProof;
    signature: string;
}
/**
 * @remark This method generates a ZKProof instance based on a specific circuit code
 *         The contents in `zkCred` is always trusted by API for now.
 * @param zkCred - An instance of ZKCredential
 * @param code - The code of the circuit to apply
 * @returns An instance of ZKProof
 * @throws Error if circuit doesn't exist
 */
export declare const generateZKProof: (zkCred: ZKCredential, code: string) => Promise<ZKProof>;
/**
 * @remark This method verifies a ZKProof instance
 * @param zkProof - The instance of ZKProof
 * @param prover - Prover's address
 * @param purpose - The purpose of proof
 * @returns Result of proof verification
 * @throws Error if verification fails
 */
export declare const verifyZKProof: (zkProof: ZKProof, prover: string, purpose: string) => boolean;
