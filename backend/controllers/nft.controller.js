const metaplexUtil = require("../utils/metaplex.util");
const axios = require("axios");
const { none } = require("@metaplex-foundation/umi");
const { deleteCache} = require("../utils/redis.util");
const solanaSalt = "solana";

const mintNFT = async (req, res) => {
  /*
    This function will mint an NFT with the license generated
    will use the license and the image of the game to mint the NFT

    The function will receive the buyers public key, the license of the game and the id of the game in the res.locals
    */
  const license = res.locals.license;
  const juego = res.locals.juego;

  //   GET IMAGE FROM THE GAME
  const response = await axios.get(juego.imagen, {
    responseType: "arraybuffer",
    responseEncoding: null,
  });
  const buffer = Buffer.from(response.data, "utf-8");
  const imageUri = await metaplexUtil.uploadImage(buffer);
  // Upload metadata
  const metadataUri = await metaplexUtil.uploadMetadata({
    name: juego.nombre,
    description: juego.descripcion,
    image: imageUri,
    background_color: "#111827",
    attributtes: [
      {
        trait_type: "license",
        value: license,
      },
    ],
  });
  // // Create collection
  // const collectionNft = await metaplexUtil.createCollection({
  //   uri,
  //   name: juego.nombre,
  //   sellerFeeBasisPoints: 0,
  //   isCollection: true,
  //   // updateAuthority: WALLET.publicKey
  // });
  // MINT THE NFT
  const { signature } = await metaplexUtil.mintNFT({
    uri: metadataUri,
    name: "GSprout",
    symbol: "GSNFT",
    // Comission for the seller (us) for every transaction
    // 500 = 5%
    sellerFeeBasisPoints: 500,
    collection: none(),
  });
  // // SENDS THE NFT TO THE BUYER
  const buyerKey = res.locals.buyerKey;

  await metaplexUtil.transferNFT(signature, buyerKey);

  deleteCache(`${solanaSalt}:${buyerKey}`);
  res.end()
  // return res.sendStatus(201);
  
};

const fetchNFTs = async (req, res, next) => {
  const publicKey = req.params.publicKey;
  const page = parseInt(req.params.page) || 1;

  const nfts = await metaplexUtil.fetchNFTs(publicKey, page);
  if (!nfts) return res.sendStatus(404);

  req.redis = {
    key: `${solanaSalt}:${publicKey}:${page}`,
    data: nfts,
  };
  res.send(nfts).status(200);
  next();
};

const fetchNFT = async (req, res, next) => {
  const publicKey = req.params.publicKey;
  const nft = await metaplexUtil.fetchNFT(publicKey);
  if (!nft) return res.sendStatus(404);
  
  req.redis = {
    key: `${solanaSalt}:${publicKey}`,
    data: nft,
  }
  res.send(nft).status(200);
  next();
};

const generateCacheKey = (req, res, next) => {
  const { publicKey, page } = req.params;
  const key = page ? `${solanaSalt}:${publicKey}:${page}` : `${solanaSalt}:${publicKey}`;
  req.redis = {
    key
  };
  next();
};

module.exports = {
  mintNFT,
  fetchNFTs,
  fetchNFT,
  generateCacheKey,
};
