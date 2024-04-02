const metaplexUtil = require("../utils/metaplex.util");
const axios = require("axios");
const {
  none,
  TransactionBuilder,
  transactionBuilder,
} = require("@metaplex-foundation/umi");
const { deleteCache } = require("../utils/redis.util");
const solanaSalt = "solana";

const mintNFT = async (req, res) => {
  /*
    This function will mint an NFT with the license generated
    will use the license and the image of the game to mint the NFT

    The function will receive the buyers public key, the license of the game and the id of the game in the res.locals
    */
  try {
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
      _id: juego._id,
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
    const buyerKey = res.locals.buyerKey;

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
    await metaplexUtil.transferNFTWithSignature(signature, buyerKey);
    console.log("NFT MINTED to " , buyerKey);
    // deleteCache(`${solanaSalt}:${buyerKey}`);
    res.end();
    // return res.sendStatus(201);
  } catch (e) {
    console.log(e);
    res.end();
  }
};

const fetchNFTs = async (req, res, next) => {
  try{

    const publicKey = req.params.publicKey;
    const page = parseInt(req.params.page) || 1;
  
    const nfts = await metaplexUtil.fetchNFTs(publicKey, page);
    if (!nfts) return res.sendStatus(404);
  
    // req.redis = {
    //   key: `${solanaSalt}:${publicKey}:${page}`,
    //   data: nfts,
    // };
    req.toCache = nfts;
    // res.send(nfts).status(200);
    next();
  }
  catch(e){
    console.log(e);
    return res.status(500).send(e);
  }
};

const fetchNFT = async (req, res, next) => {
  try{
    const publicKey = req.params.publicKey;
    const nft = await metaplexUtil.fetchNFT(publicKey);
    if (!nft) return res.sendStatus(404);
  
    // req.redis = {
    //   key: `${solanaSalt}:${publicKey}`,
    //   data: nft,
    // }
    req.toCache = nft;
    // res.send(nft).status(200);
    next();

  }
  catch(e){
    console.log(e);
    return res.status(500).send(e);
  }
};

// WIP
const generateTransferTransaction = async (req, res) => {
  /* This functions will generate a transaction in Umi, convert it to web3 and return it 
    The wallet in the frontend will sign the transaction and send it to the blockchain
  */

  try {
    const { splToken, publicKey } = req.body;
    const nft = await metaplexUtil.fetchNFT(splToken);
    if (!nft) return res.status(404);
    // const redeemInstructions = await metaplexUtil.redeemNFT(nft.id);
    // const decompressInstructions = await metaplexUtil.decompressNFT(publicKey, nft.id);
    const transferInstructions = await metaplexUtil.transferNFTWithPublicKey(
      publicKey,
      nft.id
    );
    const transaction = await metaplexUtil.createTransaction(
      /*redeemInstructions,decompressInstructions,*/ transferInstructions
    );

    const serializedTransaction = await metaplexUtil.serializeTransaction(
      transaction
    );
    return res.json(serializedTransaction).status(200);
  } catch (e) {
    return res.status(500).send(e);
  }
};

module.exports = {
  mintNFT,
  fetchNFTs,
  fetchNFT,
  generateTransferTransaction,
  // generateCacheKey,
};
