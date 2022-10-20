import * as did from './did';
import * as circuit from './circuit';
import * as credential from './credential';
import * as constraints from './constraints';
import * as zkproof from './zkproof';
export declare const zkDID: {
    did: typeof did;
    circuit: typeof circuit;
    credential: typeof credential;
    constraints: typeof constraints;
    zkproof: typeof zkproof;
};
export default zkDID;
