const { createUmi } = require("@metaplex-foundation/umi-bundle-defaults");
const { mplBubblegum } = require("@metaplex-foundation/mpl-bubblegum");
const { Connection } = require("@solana/web3.js");
const {
  keypairIdentity,
  createSignerFromKeypair,
} = require("@metaplex-foundation/umi");
const base58 = require("bs58");
const { irysUploader } = require("@metaplex-foundation/umi-uploader-irys");
const { dasApi } = require("@metaplex-foundation/digital-asset-standard-api");
const { mplTokenMetadata } = require("@metaplex-foundation/mpl-token-metadata");

// CONNECTION TO QUICKNODE
const RPC_URL = process.env.RPC_URL;
const CONNECTION = new Connection(RPC_URL, "confirmed");

// UMI
const umi = createUmi(CONNECTION).use(mplBubblegum()).use(irysUploader()).use(mplTokenMetadata()).use(dasApi())
console.log(umi.rpc.getEndpoint(),umi.rpc.getCluster());
// // // OUR OWN WALLET
const privateKey = process.env.WALLET_PRIVATE_KEY;
const privateKeyBytes = base58.decode(privateKey);
const WALLET = umi.eddsa.createKeypairFromSecretKey(privateKeyBytes);
// ADDS WALLET TO UMI
umi.use(keypairIdentity(WALLET));

// MERKLE TREE
const merkleTree = process.env.MERKLE_TREE.split(" ").map((x) => parseInt(x));
const MERKLETREE_KP = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(merkleTree)
);
const MERKLETREE_SIGNER = createSignerFromKeypair(umi, MERKLETREE_KP);


module.exports = { umi, WALLET, MERKLETREE_SIGNER, CONNECTION};
