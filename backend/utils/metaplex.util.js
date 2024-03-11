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
const { umi, WALLET, MERKLETREE_SIGNER } = require("../apis/umi.api");

const uploadMetadata = async (data) => {
  /*
    This function will receive the metadata of the game and will upload it to the blockchain
    data: json object with the metadata of the nft

    Will return the uri of the metadata
  */
  const uri = await umi.uploader.uploadJson(data);
  return uri;
};

const uploadImage = async (imageBuffer) => {
  /*
    This function will receive the image of the game and will upload it to the blockchain
    imageBuffer: buffer with the image of the game

    Will return the uri of the image
  */
  const file = createGenericFile(imageBuffer, "image");
  const imageUri = await umi.uploader.upload([file]);
  return imageUri[0];
};

const mintNFT = async (data) => {
  /*
    This function will mint an NFT
    The function will receive the json object with the metadata of the game and the image
    Returns the NFT minted
    You can get the nft signature from here

  */
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

// // Verify NFT
// const verifyNFT = async (assetWithProof) => {
//   /*
//     This function will verify the NFT
//     assetWithProof: json object with the asset and the proof of the Merkle tree
//     */
//   const creator = generateSigner(umi);
//   await verifyCreator(umi, { ...assetWithProof, creator }).sendAndConfirm(umi, {
//     confirm: { commitment: "finalized" },
//   });
// };
const getWalletNFTs = async (publicKey) => {
  /*
    This function will receive the public key of the wallet and will return the NFTs of the wallet
    publicKey: public key of the wallet
    */
  const nfts = await umi.rpc.searchAssets({
    owner: publicKey,
    limit: 10,
    page: 1,
    compressed: true,
  });
  return nfts;
};

const transferNFT = async (
  signature,
  toOwner,
  fromOwner = publicKey(WALLET.publicKey)
) => {
  /*
    This function will transfer the NFT to the new owner
    signature: signature of the NFT
    toOwner: public key of the new owner
    fromOwner: public key of the current owner
    */
  const [assetId, bump] = await fetchNFT(signature);
  const assetWithProof = await getAssetWithProof(umi, assetId);

  await transfer(umi, {
    ...assetWithProof,
    leafOwner: fromOwner,
    newLeafOwner: toOwner,
  }).sendAndConfirm(umi, { confirm: { commitment: "finalized" } });

  // await delegateNFT(assetId, toOwner);
};

const delegateNFT = async (
  assetId,
  leafOwner = publicKey(WALLET.publicKey),
  newLeafDelegate = publicKey(WALLET.publicKey)
) => {
  /*
    This function will delegate permissions of the NFT to the new owner
    assetId: id of the NFT
    leafOwner: public key of the current owner
    newLeafDelegate: public key of the new owner
    */
  const assetWithProof = await getAssetWithProof(umi, assetId);
  await delegate(umi, {
    ...assetWithProof,
    leafOwner: leafOwner,
    previousLeafDelegate: leafOwner,
    newLeafDelegate: newLeafDelegate,
  }).sendAndConfirm(umi, { confirm: { commitment: "confirmed" } });
};

const fetchNFT = async (signature) => {
  /*
    This function will receive the signature of the NFT and will return the id of the NFT
    signature: signature of the NFT
    */
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

const fetchNFTs = async (publicKey) => {
  const nfts = await umi.rpc.getAssetsByOwner({
    owner: publicKey,
    limit: 10,
    page: 0,
  });
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
  delegateNFT,
  // createCollection,
  mintNFT,
  transferNFT,
  getWalletNFTs,
  fetchNFT,
  fetchNFTs,
};
