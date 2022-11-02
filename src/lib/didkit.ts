let DIDKit: any;
if (this === window) {
  DIDKit = require('@spruceid/didkit-wasm');
} else {
  const requireTemp = require;
  DIDKit = requireTemp('@spruceid/didkit-wasm-node');
}

export default DIDKit;
