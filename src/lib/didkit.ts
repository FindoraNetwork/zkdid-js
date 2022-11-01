// import DIDKitNode from '@spruceid/didkit-wasm-node';
// import DIDKitBrowser from '@spruceid/didkit-wasm';
const DIDKit = this === window ? require('@spruceid/didkit-wasm') : require('@spruceid/didkit-wasm-node');
// const DIDKit = global === window ? DIDKitBrowser : DIDKitNode;
// const DIDKit = DIDKitNode;

export default DIDKit;
