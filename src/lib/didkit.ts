let DIDKit: any;
if (globalThis === window) {
  DIDKit = require('@spruceid/didkit-wasm');
} else {
  DIDKit = require('@spruceid/didkit-wasm-node');
}

export default DIDKit;
