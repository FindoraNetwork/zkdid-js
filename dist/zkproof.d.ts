import { ZKCredential } from './credential';
export interface ZKProof {
    code: string;
    proof: string;
    purpose: string;
    commitment: string;
}
export interface SignedZKProof {
    body: ZKProof;
    signature: string;
}
/**
 * @remark This method generates a ZKProof instance based on a specific circuit
 *         The contents in `zkCred` is always trusted by API for now.
 * @param zkCred - An instance of ZKCredential
 * @param code - The circuit code
 * @returns An instance of ZKProof
 * @throws Error if circuit doesn't exist
 */
export declare const generateZKProof: (zkCred: ZKCredential, code: string) => Promise<ZKProof>;
/**
 * @remark This method verifies a ZKProof instance
 *
 * @param prover - Prover's address
 * @param zkProof - The instance of ZKProof
 * @returns Result of proof verification
 */
export declare const verifyZKProof: (prover: string, zkProof: ZKProof) => boolean;
/**
 * @remark This method verifies a SignedZKProof instance
 * @param signed - The instance of SignedZKProof
 * @returns Result of proof verification
 */
export declare const verifySignedZKProof: (signed: SignedZKProof) => boolean;
