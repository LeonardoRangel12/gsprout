const { Connection, Keypair } = require("@solana/web3.js");
const {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  toMetaplexFile,
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
const axios = require("axios");
const mintNFT = async (req, res) => {
  /*
    This function will mint an NFT with the license generated
    will use the license and the image of the game to mint the NFT

    The function will receive the buyers public key, the license of the game and the id of the game in the res.locals
    */
  const license = res.locals.license;
  const juego = res.locals.juego;

  //   GET IMAGE FROM THE GAME
  const response = await axios.get(juego.imagen, {responseType: "arraybuffer", responseEncoding: null});
  const buffer = Buffer.from(response.data, "utf-8");
  const file = toMetaplexFile(buffer, "image.jpg");

  // UPLOAD THE IMAGE TO THE STORAGE
  const imageUri = await METAPLEX.storage().upload(file);
  // Upload metadata
  const { uri } = await METAPLEX.nfts().uploadMetadata({
    name: juego.nombre,
    description: juego.descripcion,
    image: imageUri,
    license: license,
  });

  // Create collection
  const { collectionNft } = await METAPLEX.nfts().create({
    uri,
    name: "GSprout",
    sellerFeeBasisPoints: 0,
    isCollection: true,
  },
  {commitment: "finalized"});

  // MINT THE NFT
  const { nft } = await METAPLEX.nfts().create(
    {
      uri,
      name: "GSprout NFT",
      // Comission for the seller (us) for every transaction
      // 500 = 5%
      sellerFeeBasisPoints: 500,
      collection: collectionNft,
    },
    {
      commitment: "finalized",
    }
  );

  // // SENDS THE NFT TO THE BUYER
  const buyerKey = res.locals.buyerKey;

  const transferTx = await METAPLEX.nfts().transfer({
    nftOrSft: nft,
    fromOwner: WALLET.publicKey,
    toOwner: buyerKey,
  });
  return res.sendStatus(201);
  // return res.send(nft.mint.address.toBase58());
};
module.exports = {
  mintNFT,
};
