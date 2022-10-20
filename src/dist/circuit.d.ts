import { IConstraint } from './constraints';
export declare class ZKCircuit {
    private constraints;
    constructor(constraints?: Array<IConstraint>);
    addConstraint(constraint: IConstraint): void;
    toCode(): string;
    toBytes(): string;
    static fromBytes(bytes: string): ZKCircuit;
    verify(fields: Map<string, number | string>): boolean;
}
/**
 * @param purpose - The purpose code
 * @param code - The circuit code
 * @returns `true` if the circuit exists or `false` otherwise
 */
export declare const hasCircuit: (purpose: string, code: string) => boolean;
/**
 * @param purpose - The purpose code
 * @param code - The circuit code
 * @returns The circuit instance
 * @throws Error if circuit doesn't exist
 */
export declare const getCircuit: (purpose: string, code: string) => ZKCircuit;
/**
 * @remark This method creates a new circuit under `family`
 * @param purpose - The purpose code
 * @param circuit - The circuit instance
 * @throws Error if circuit already exists
 */
export declare const createCircuit: (purpose: string, circuit: ZKCircuit) => void;
