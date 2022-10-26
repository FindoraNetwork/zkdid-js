export type address = string;

export interface DID {
  id: string;
}

export enum CacheType {
  DID = 'did',
  CIRCUIT = 'circuit',
  ZKCredential = 'zkCred',
}

export interface CircuitObj {
  target: number;
}
