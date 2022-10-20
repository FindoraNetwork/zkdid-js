import { DID } from './types';
export declare abstract class ICredential {
    private did;
    constructor(did: DID);
    getDID(): DID;
    getCommitment(): string;
    abstract getPurpose(): string;
    abstract getEncrypted(): string;
}
export interface ZKCredential {
    did: DID;
    purpose: string;
    credential: string;
    commitment: string;
}
/**
 * @param did - The did
 * @param purpose - Credential purpose code (e.g., '7fed71c88753dc82cd80d84e6f28c588d4c15b88')
 * @returns `true` if `did` already links to a ZKCredential or `false` otherwise
 */
export declare const hasZKCredential: (did: DID, purpose: string) => boolean;
/**
 * @param did - The did
 * @param purpose - Credential purpose code (e.g., '7fed71c88753dc82cd80d84e6f28c588d4c15b88')
 * @returns The ZKCredential instance linked to `did`
 * @throws Error if ZKCredential doesn't exist
 */
export declare const getZKCredential: (did: DID, purpose: string) => ZKCredential;
/**
 * @remark This method converts any credential into a ZKCredential instance and links it to `did`
 *         The contents in `cred` is always trusted by API for now.
 * @param cred - The credential instance
 * @returns The ZKCredential instance
 */
export declare const createZKCredential: (cred: ICredential) => ZKCredential;
export declare class GPACredential extends ICredential {
    private GPAScore;
    constructor(did: DID, gpa: number);
    static issuer(): string;
    static purpose(): string;
    getGPAScore(): number;
    getIssuer(): string;
    getPurpose(): string;
    getEncrypted(): string;
}
export declare class CreditScoreCredential extends ICredential {
    private creditScore;
    constructor(did: DID, credit: number);
    static issuer(): string;
    static purpose(): string;
    getCreditScore(): number;
    getIssuer(): string;
    getPurpose(): string;
    getEncrypted(): string;
}
export declare class AnnualIncomeCredential extends ICredential {
    private annualIncomeUsd;
    constructor(did: DID, income: number);
    static issuer(): string;
    static purpose(): string;
    getAnnualIncomeUsd(): number;
    getIssuer(): string;
    getPurpose(): string;
    getEncrypted(): string;
}
