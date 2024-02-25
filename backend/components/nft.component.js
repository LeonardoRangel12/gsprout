const { Connection, Keypair } = require("@solana/web3.js");
const {
  getOrCreateAssociatedTokenAccount,
  mintTo,
} = require("@solana/spl-token");
const fs = require("fs");
const {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
} = require("@metaplex-foundation/js");
const JuegoService = require("../services/juego.service");
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

const mintNFT = async (req, res) => {
  /*
    This function will mint an NFT with the license generated
    will use the license and the image of the game to mint the NFT

    The function will receive the buyers public key, the license of the game and the id of the game in the res.locals
    */
  const buyerKey = res.locals.buyerKey;
  const license = res.locals.license;
  const juego = res.locals.juego;

  console.log(juego.nombre);

  // MINT THE NFT
  const { nft } = await METAPLEX.nfts().create(
    {
      uri: license,
      name: "NFT",
      sellerFeeBasisPoints: 0,
      creators: [
        {
          address: WALLET.publicKey,
          verified: true,
          share: 100,
        },
      ],
      properties: {
        files: [
          {
            uri: juego.imagen,
            type: "image/jpg",
          },
        ],
      },
    },
    {
      commitment: "confirmed",
    }
  );

  // console.log(nft.mint.address.toBase58());
  // // SENDS THE NFT TO THE BUYER

  // const buyerTokenAccount = await getOrCreateAssociatedTokenAccount(
  //   buyerKey,
  //   nft.mint.address
  // );

  // await mintTo(nft.mint, nft, buyerTokenAccount, WALLET, [], {
  //   commitment: "finalized",
  // });

  return res.status(201);
  // return res.send(nft.mint.address.toBase58());
};

module.exports = {
  mintNFT,
};
