let DIDKit: any;
if (this === window) {
  DIDKit = require('@spruceid/didkit-wasm');
} else {
  let wasmLib = '@spruceid/didkit-wasm-node';
  DIDKit = require(wasmLib);
}

export default DIDKit;
