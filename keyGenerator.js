const { randomBytes, createHash } = require('crypto');
const secp256k1 = require('secp256k1');
const bs58 = require('bs58');

// Generate 32 Bytes Private Key with crypto.randomBytes()
let privKey;
do {
  privKey = randomBytes(32);
} while (!secp256k1.privateKeyVerify(privKey));

// Generate compressed Public Key
const pubKey = secp256k1.publicKeyCreate(privKey, true);

console.log(`Private Key: ${privKey.toString('hex')}`);
console.log(`Base58 Private Key: ${bs58.encode(privKey)}`);
console.log(`Compressed Public Key: ${pubKey.toString('hex')}`);

// Generate Encrypted Public Key
const sha256PubKey = createHash('sha256')
  .update(pubKey, 'hex')
  .digest('hex');

const ripemd160 = createHash('ripemd160')
  .update(sha256PubKey, 'hex')
  .digest('hex');

console.log(`Encrypted Public Key: ${ripemd160}`);

// Add Network Bytes
const networkbyte = '00' + ripemd160;

console.log(`Encrypted Public Key With Network Bytes: ${networkbyte}`);

// Generate Checksum of Encrypted Public Key
const firstHash = createHash('sha256')
  .update(networkbyte, 'hex')
  .digest('hex');
const doubleHash = createHash('sha256')
  .update(firstHash, 'hex')
  .digest('hex');

const checksum = doubleHash.slice(0, 8);
console.log(`Checksum of Encrypted Public Key: ${checksum}`);

const mainnetchecksum = networkbyte + checksum;

console.log(
  `Concatenated Encrypted Public Key with Checksum: ${mainnetchecksum}`
);

// Generate Bitcoin Wallet Address
wallet = bs58.encode(Buffer.from(mainnetchecksum, 'hex'));

console.log(`Wallet Address: ${wallet}`);
