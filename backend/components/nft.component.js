const { Connection, Keypair, LAMPORTS_PER_SOL } = require("@solana/web3.js");
const {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  setAuthority,
  transfer,
} = require("@solana/spl-token");
const base58 = require("bs58");

const JuegoService = require("../services/juego.service");
const mintNFT = async (req, res) => {
  /*
    This function will mint an NFT with the license generated
    will use the license and the image of the game to mint the NFT

    The function will receive the buyers public key, the license of the game and the id of the game in the res.locals
    */
  const buyerKey = res.locals.buyerKey;
  const license = res.locals.license;
  const juegoId = res.locals.id;
  const juego = await JuegoService.getJuegoById(juegoId);

  if (!juego) {
    return res.status(404).send("Juego no encontrado");
  }
  const quickNodeEndpoint = process.env.QUICKNODE_URL;
  const connection = new Connection(quickNodeEndpoint, "confirmed");
  // Mint the NFT

  // SIGNER (us)

  const privateKey = process.env.WALLET_PRIVATE_KEY;
  const privateKeyBytes = base58.decode(privateKey);
  const signer = Keypair.fromSecretKey(privateKeyBytes);

//   create mint
  let signature = await mintTo(connection, signer, license, buyerKey, signer.publicKey, 1);

  await setAuthority(
    connection,
    buyerKey,
    buyerKey,
    signer.publicKey,
    0,
    null,
  );

  signature = await transfer(
    connection,
    signer,
    signer.publicKey,
    buyerKey,
    signer.publicKey,
    1,
  );

    return res.status(200).send({ signature });
};

module.exports = {
  mintNFT,
};
