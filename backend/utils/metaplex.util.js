// const { toMetaplexFile } = require("@metaplex-foundation/js");
// const {
//   METAPLEX,
//   WALLET,
// } = require("../configurations/metaplex.configuration");
// const { PublicKey } = require("@solana/web3.js");

// const uploadImage = async (imageBuffer) => {
//   const file = toMetaplexFile(imageBuffer, "image.jpg");

//   // UPLOAD THE IMAGE TO THE STORAGE
//   const imageUri = await METAPLEX.storage().upload(file);
//   return imageUri;
// };

// const uploadMetadata = async (metadata) => {
//   const uri = await METAPLEX.nfts().uploadMetadata(metadata);
//   return uri;
// };

// const createCollection = async (collectionData) => {
//   const collectionNft = await METAPLEX.nfts().create(collectionData, {
//     commitment: "finalized",
//   });
//   return collectionNft;
// };

// const mintNFT = async (nftData) => {
//   const nft = await METAPLEX.nfts().create(nftData, {
//     commitment: "finalized",
//   });
//   return nft;
// };

// const transferNFT = async (nft, toOwner, fromOwner = WALLET.publicKey) => {
//   METAPLEX.nfts().transfer(
//     {
//       nftOrSft: nft,
//       fromOwner: fromOwner,
//       toOwner: toOwner,
//     },
//     { commitment: "finalized" }
//   );
// };

// const getWalletNFTs = async (publicKey) => {
//   const nfts = await METAPLEX.nfts().findAllByOwner({
//     owner: new PublicKey(publicKey),
//   });
//   return nfts;
// };

const {
  generateSigner,
  createSignerFromKeypair,
  createGenericFile,
  publicKey,
} = require("@metaplex-foundation/umi");
const {
  createTree,
  fetchMerkleTree,
  mintV1,
  transfer,
  getAssetWithProof,
  findLeafAssetIdPda,
  parseLeafFromMintV1Transaction,
  delegate,
  verifyCreator,
} = require("@metaplex-foundation/mpl-bubblegum");
// Setting up the merkle tree
const {
  umi,
  WALLET,
  MERKLETREE_SIGNER,
} = require("../../shared/apis/umi.api");

const uploadMetadata = async (data) => {
  const uri = await umi.uploader.uploadJson(data);
  return uri;
};

const uploadImage = async (imageBuffer) => {
  const file = createGenericFile(imageBuffer, "image");
  const imageUri = await umi.uploader.upload([file]);
  return imageUri[0];
};

const mintNFT = async (data) => {
  let metadata = data;
  metadata.creators = [
    { address: umi.identity.publicKey, verified: false, share: 100 },
  ];
  const nft = await mintV1(umi, {
    leafOwner: WALLET.publicKey,
    leafDelegate: WALLET.publicKey,
    merkleTree: MERKLETREE_SIGNER,
    metadata,
  }).sendAndConfirm(umi, { confirm: { commitment: "finalized" } });
  return nft;
};

// Verify NFT
const verifyNFT = async (assetWithProof) => {
  const creator = generateSigner(umi);
  await verifyCreator(umi, { ...assetWithProof, creator }).sendAndConfirm(umi, {
    confirm: { commitment: "finalized" },
  });
};
const getWalletNFTs = async (publicKey) => {
  const nfts = await umi.nfts.findAllByOwner({
    owner: publicKey,
  });
  return nfts;
};

const transferNFT = async (
  signature,
  toOwner,
  fromOwner = publicKey(WALLET.publicKey)
) => {
  const [assetId, bump] = await fetchNFT(signature);
  const assetWithProof = await getAssetWithProof(umi, assetId);

  await verifyNFT(assetWithProof);

  await transfer(umi, {
    ...assetWithProof,
    leafOwner: fromOwner,
    newLeafOwner: toOwner,
  }).sendAndConfirm(umi, { confirm: { commitment: "finalized" } });

  // await delegateNFT(assetId, toOwner);
};

// const delegateNFT = async (assetId, leafOwner = publicKey(WALLET.publicKey), newLeafDelegate = publicKey(WALLET.publicKey)) => {
//   const assetWithProof = await getAssetWithProof(umi, assetId);
//   await delegate(umi, {
//     ...assetWithProof,
//     leafOwner: leafOwner,
//     previousLeafDelegate: leafOwner,
//     newLeafDelegate: newLeafDelegate,
//   }).sendAndConfirm(umi, { confirm: { commitment: "confirmed" } });
// };

const fetchNFT = async (signature) => {
  try {
    const leaf = await parseLeafFromMintV1Transaction(umi, signature);
    const pda = findLeafAssetIdPda(umi, {
      merkleTree: MERKLETREE_SIGNER,
      leafIndex: leaf.nonce,
    });

    return pda;
  } catch (e) {
    console.log(e);
  }
};

///////////////////////////////////////////////////////////////////
// ONE USE ONLY
// WHEN CREATING THE MERKLE TREE
const createBubblegumTree = async () => {
  // Generate a signer for the merkle tree
  const merkleTree = generateSigner(umi);
  console.log(merkleTree.secretKey);
  // Sets the creator as us
  const treeCreator = createSignerFromKeypair(umi, WALLET);
  const builder = await createTree(umi, {
    merkleTree,
    maxDepth: 14,
    treeCreator,
    maxBufferSize: 64,
    public: false,
  });

  const res = await builder.sendAndConfirm(umi);

  // await fetchTree();
};
//////////////////////////////////////////////////////////////
// TESTING ONLY
const fetchTree = async () => {
  await fetchMerkleTree(umi, MERKLETREE_SIGNER);
};

module.exports = {
  createBubblegumTree,
  fetchTree,
  uploadImage,
  uploadMetadata,
  // createCollection,
  mintNFT,
  transferNFT,
  getWalletNFTs,
  fetchNFT,
};
