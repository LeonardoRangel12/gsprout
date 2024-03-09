const { WALLET } = require("../configurations/metaplex.configuration");
const metaplexUtil = require("../utils/metaplex.util");
const axios = require("axios");
const { PublicKey } = require("@solana/web3.js");
const { none, percentAmount } = require("@metaplex-foundation/umi");
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
    license: license,
  });
  // // Create collection
  // const collectionNft = await metaplexUtil.createCollection({
  //   uri,
  //   name: "GSprout",
  //   sellerFeeBasisPoints: 0,
  //   isCollection: true,
  //   // updateAuthority: WALLET.publicKey
  // });
  // MINT THE NFT
  const { signature } = await metaplexUtil.mintNFT({
    uri: metadataUri,
    name: "GSprout NFT",
    // Comission for the seller (us) for every transaction
    // 500 = 5%
    sellerFeeBasisPoints: 500,
    collection: none(),
  });
  // // SENDS THE NFT TO THE BUYER
  const buyerKey = res.locals.buyerKey;

  await metaplexUtil.transferNFT(signature, buyerKey);
  console.log("TRANSFER FUNCIONA");
  return res.sendStatus(201);
  // return res.send(nft.mint.address.toBase58());
};

const getWalletNFTs = async (req, res) => {
  const publicKey = req.params.publicKey;
  const nfts = await metaplexUtil.getWalletNFTs({ owner: publicKey });
  return res.send(nfts);
};

module.exports = {
  mintNFT,
  getWalletNFTs,
};
