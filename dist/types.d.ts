export declare type address = string;
export interface DID {
    id: string;
}
export declare enum CacheType {
    DID = "did",
    CIRCUIT = "circuit",
    ZKCredential = "zkCred"
}
export interface CircuitObj {
    target: number;
}
