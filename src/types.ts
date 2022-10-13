export type address = string;

export interface DID {
  id: string;
}

export enum CacheType {
  DID = 'did',
  // CIRCUIT = 'circuit',
  CIRCUIT_FAMILY = 'circuit-family',
  ZKCredential = 'zkCred',
}

export interface CircuitObj {
  target: number;
}
