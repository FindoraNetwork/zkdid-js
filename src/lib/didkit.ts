let DIDKit: any;
if (typeof window === "undefined") {
  DIDKit = require('@spruceid/didkit-wasm');
} else {
  DIDKit = require('@spruceid/didkit-wasm-node');
}

export default DIDKit;
