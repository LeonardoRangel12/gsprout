const { Connection, Keypair } = require("@solana/web3.js");
const {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
} = require("@metaplex-foundation/js");
const base58 = require("bs58");
const QUICKNODE_URL = process.env.QUICKNODE_URL;
const CONNECTION = new Connection(QUICKNODE_URL, "confirmed");
// OUR OWN WALLET
const privateKey = process.env.WALLET_PRIVATE_KEY;
const privateKeyBytes = base58.decode(privateKey);
const WALLET = Keypair.fromSecretKey(privateKeyBytes);

const METAPLEX = Metaplex.make(CONNECTION)
  .use(keypairIdentity(WALLET))
  .use(
    bundlrStorage({
      address: "https://devnet.bundlr.network",
      providerUrl: QUICKNODE_URL,
      timeout: 60000,
    })
  );

module.exports = {METAPLEX, WALLET};