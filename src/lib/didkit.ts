let DIDKit: any;
if (typeof window === "undefined") {
  DIDKit = require('@spruceid/didkit-wasm-node');
} else {
  DIDKit = require('@spruceid/didkit-wasm');
}

export default DIDKit;
