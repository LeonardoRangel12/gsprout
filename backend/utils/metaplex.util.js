const { toMetaplexFile } = require("@metaplex-foundation/js");
const {
  METAPLEX,
  WALLET,
} = require("../configurations/metaplex.configuration");

const uploadImage = async (imageBuffer) => {
  const file = toMetaplexFile(imageBuffer, "image.jpg");

  // UPLOAD THE IMAGE TO THE STORAGE
  const imageUri = await METAPLEX.storage().upload(file);
  return imageUri;
};

const uploadMetadata = async (metadata) => {
  const { uri } = await METAPLEX.nfts().uploadMetadata(metadata);
  return uri;
};

const createCollection = async (collectionData) => {
  const { collectionNft } = await METAPLEX.nfts().create(collectionData, {
    commitment: "finalized",
  });
  return collectionNft;
};

const mintNFT = async (nftData) => {
  const { nft } = await METAPLEX.nfts().create(nftData, {
    commitment: "finalized",
  });
  return nft;
};

const transferNFT = async (nft, toOwner, fromOwner = WALLET.publicKey) => {
  METAPLEX.nfts().transfer(
    {
      nftOrSft: nft,
      fromOwner: fromOwner,
      toOwner: toOwner,
    },
    { commitment: "finalized" }
  );
};
module.exports = {
  uploadImage,
  uploadMetadata,
  createCollection,
  mintNFT,
  transferNFT,
};
