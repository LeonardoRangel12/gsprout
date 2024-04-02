const {
  generateSigner,
  createSignerFromKeypair,
  createGenericFile,
  publicKey,
  transactionBuilder,
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
  redeem,
  decompressV1,
  findVoucherPda,
} = require("@metaplex-foundation/mpl-bubblegum");
// Setting up the merkle tree
const { umi, WALLET, MERKLETREE_SIGNER } = require("../apis/umi.api");
const {
  toWeb3JsTransaction,
} = require("@metaplex-foundation/umi-web3js-adapters");
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

const mintNFT = async (data, owner = WALLET.publicKey) => {
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
    leafOwner: publicKey(owner),
    leafDelegate: publicKey(owner),
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

const transferNFTWithSignature = async (
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

  const getNFTPublicKey = async (signature) => {
    /*
      This INTERNAL function will receive the signature of the NFT and will return the id of the NFT
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

  const [assetId, bump] = await getNFTPublicKey(signature);
  if (!assetId) {
    return;
  }
  const assetWithProof = await getAssetWithProof(umi, assetId);
  await transfer(umi, {
    ...assetWithProof,
    leafOwner: fromOwner,
    newLeafOwner: toOwner,
  }).sendAndConfirm(umi, { confirm: { commitment: "finalized" } });
  console.log("TRANSFERRED");
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

const fetchNFT = async (publicKey) => {
  /*
    This function will receive the public key of the wallet and will return the NFTs of the wallet
    publicKey: public key of the wallet
  */
  try {
    const nft = await umi.rpc.getAsset(publicKey);
    return nft;
  } catch (e) {
    console.log(e);
  }
};

const fetchNFTs = async (pk, page = 1) => {
  /*
    This function will receive the public key of the wallet and will return the NFTs of the wallet
    pk: public key of the wallet
    page: page of the NFTs
    */
  const nfts = await umi.rpc.searchAssets({
    owner: publicKey(pk),
    creator: WALLET.publicKey,
    compressed: true,
  });
  return nfts;
};

const redeemNFT = async (assetId) => {
  /*
    This function will redeem the NFT
    assetId: id of the NFT
    */
  const assetWithProof = await getAssetWithProof(umi, assetId);

  const transactionBuilder = redeem(umi, assetWithProof);

  return transactionBuilder;
};

const decompressNFT = async (owner, assetId) => {
  /*
    This function will decompress the NFT
    assetId: id of the NFT
    */
  const assetWithProof = await getAssetWithProof(umi, assetId);
  const transactionBuilder = decompressV1(umi, {
    ...assetWithProof,
    leafOwner: publicKey(owner),
    mint: assetId,
    voucher: findVoucherPda(umi, assetWithProof),
  });
  return transactionBuilder;
};

const transferNFTWithPublicKey = async (
  owner,
  assetPK,
  toOwner = WALLET.publicKey
) => {
  /*
    This function will transfer the NFT to the new owner
    owner: public key of the current owner
    assetPK: public key of the NFT
    toOwner: public key of the new owner
    */
  const assetWithProof = await getAssetWithProof(umi, assetPK);
  const transactionBuilder = transfer(umi, {
    ...assetWithProof,
    leafOwner: publicKey(owner),
    newLeafOwner: publicKey(toOwner),
  });
  return transactionBuilder;
};

const createTransaction = async (...transactions) => {
  /*
    This function will create a transaction and transform it to web3 transaction
    instructions: array of instructions
    */
   let transactionBui = transactionBuilder();
  for (let transaction of transactions) {
    transactionBui = transactionBui.add(transaction);
  }

  const transaction = await transactionBui.buildAndSign(umi);
  const web3Transaction = toWeb3JsTransaction(transaction);
  return web3Transaction;
};
const serializeTransaction = async (transaction) => {
  /*
    This function will serialize the transaction
    transaction: transaction to serialize
    */
   try{
    const base = await transaction.serialize();
    const buffer = Buffer.from(base).toString("base64");
    return buffer;

   }
    catch(e){
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
  delegateNFT,
  // createCollection,
  mintNFT,
  transferNFTWithSignature,
  fetchNFT,
  fetchNFTs,
  transferNFTWithPublicKey,
  serializeTransaction,
  redeemNFT,
  decompressNFT,
  createTransaction,
};
