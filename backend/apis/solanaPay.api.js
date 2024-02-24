const juegoService = require("../services/juego.service.js");
const { Connection, Keypair, PublicKey } = require("@solana/web3.js");
const { encodeURL, validateTransfer, findReference } = require("@solana/pay");
const BigNumber = require("bignumber.js");
const base58 = require("bs58");
// CONSTANTS
const destinyWallet = process.env.WALLET;
const recipient = new PublicKey(destinyWallet);
const label = "Compra de producto";
// const memo = "GSprout Demo public memo";
// const amount = new BigNumber(0.1); // 0.1 SOL
const quickNodeEndpoint = process.env.QUICKNODE_URL;
const paymentRequests = new Map();

// BUYER WALLET
// const privateKey =
//   "2BsEwrvnu7sQg8RkY8tUUcjG3G9cZ6NM8YaJ2zKuBQLmu3x62UtV94WDZdDxSXX8FGxgsW2znPoiXaF8tgUNJx4k";
// const privateKeyBytes = base58.decode(privateKey);
// const keypair = Keypair.fromSecretKey(privateKeyBytes);
// const publicKey = "9m5TqpsHkPmTYz5aRraLd1ntTtAaLuWuXcMCsRpuvjg8"

const generatePayment = async (req, res) => {
  if (req.method === "POST") {
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const juego = juegoService.getJuegoById(req.params.id);
    if (!juego) {
      return res.status(404).send("Juego not found");
    }

    const amount = new BigNumber(juego.precio);
    const message = juego.nombre;
    const memo = juego.nombre;

    try {
      const reference = new Keypair().publicKey;
      const urlData = await generateUrl(
        recipient,
        amount,
        reference,
        label,
        message,
        memo
      );
      const ref = reference.toBase58();
      paymentRequests.set(ref, {
        recipient,
        amount,
        memo,
      });
      const { url } = urlData;
      return res.status(200).send({ url: url.toString(), ref });
    } catch (error) {
      return res.status(500).send("Internal Server Error");
    }
  } else if (req.method === "GET") {
    const reference = req.params.reference;
    if (!reference) {
      res.status(400).send("Missing reference query parameter");
      return;
    }

    try {
      const referencePublicKey = new PublicKey(reference.toString());
      const response = await verifyTransaction(referencePublicKey);
      console.log(response);
      if (response) {
        res.status(200).send("Payment verified");
      } else {
        res.status(400).send("Payment not verified");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(405).send("Method not allowed");
  }
};

async function generateUrl(recipient, amount, reference, label, message, memo) {
  const url = encodeURL({
    recipient,
    amount,
    reference,
    label,
    message,
    memo,
  });
  return { url };
}

const verifyTransaction = async (reference) => {
  const paymentData = paymentRequests.get(reference.toBase58());
  if (!paymentData) {
    return false;
  }

  const { recipient, amount, memo } = paymentData;

  // Devnet connection
  const connection = new Connection(quickNodeEndpoint, "confirmed");

  const found = await findReference(connection, reference);

  console.log(found.signature);

  const response = await validateTransfer(
    connection,
    found.signature,
    {
      recipient,
      amount,
      splToken: undefined,
      reference,
      // memo
    },
    { commitment: "confirmed" }
  );

  if (response) {
    paymentRequests.delete(reference.toBase58());
  }
  return response;
};

module.exports = {
  generateUrl,
  generatePayment,
};
