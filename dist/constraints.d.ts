export declare const Constraints: Class<any>[];
interface Class<T> {
    new (...args: any[]): T;
}
export declare abstract class IConstraint {
    private field;
    constructor(field: string);
    getField(): string;
    abstract verify(value: any): boolean;
    /**
     * Serialize the input parameters of its own constructor
     */
    abstract serialize(): string;
}
export declare const registerConstraint: (ConstraintClass: Class<IConstraint>) => void;
export declare const getKeyOfConstraint: (ctr: any) => number;
export declare const getConstraintByKey: (key: number) => Class<any>;
export declare class ConstraintINT_RNG extends IConstraint {
    private lower;
    private upper;
    constructor(field: string, lower: number, upper?: number);
    verify(value: any): boolean;
    serialize(): string;
}
export declare class ConstraintSTR_RNG extends IConstraint {
    range: string[];
    constructor(field: string, range: string[]);
    verify(value: any): boolean;
    serialize(): string;
}
export declare const CONSTRAINT_GPA_30: ConstraintINT_RNG;
export declare const CONSTRAINT_GPA_35: ConstraintINT_RNG;
export declare const CONSTRAINT_CREDIT_650: ConstraintINT_RNG;
export declare const CONSTRAINT_CREDIT_700: ConstraintINT_RNG;
export declare const CONSTRAINT_INCOME_65K: ConstraintINT_RNG;
export declare const CONSTRAINT_INCOME_80K: ConstraintINT_RNG;
export declare const CONSTRAINT_INCOME_95K: ConstraintINT_RNG;
export declare const CONSTRAINTS_GPA: IConstraint[];
export declare const CONSTRAINTS_CREDITS: IConstraint[];
export declare const CONSTRAINTS_INCOME: IConstraint[];
export {};
