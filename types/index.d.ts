type address = string;

interface DID {
  id: string;
}

enum CacheType {
  DID = 'did',
  // CIRCUIT = 'circuit',
  CIRCUIT_FAMILY = 'circuit-family',
  ZKCredential = 'zkCred',
}

interface CircuitObj {
  target: number;
}
