const juegoService = require("../services/juego.service.js");
const { Connection, Keypair, PublicKey } = require("@solana/web3.js");
const { validateTransfer, findReference, encodeURL } = require("@solana/pay");
const BigNumber = require("bignumber.js");
const QRCode = require("qrcode"); // Importamos la librería qrcode

// CONSTANTS
const destinyWallet = process.env.WALLET;
const recipient = new PublicKey(destinyWallet);
const label = "Compra de producto";
const quickNodeEndpoint = process.env.QUICKNODE_URL;
const paymentRequests = new Map();

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

const generatePayment = async (req, res) => {
  /*
  This function will generate a payment request for the user
  Will use the juego id to get the juego and the price
  Will generate a payment request and return the url
  */

  const juego = await juegoService.getJuegoById(req.params.id);
  if (!juego) {
    return res.status(404).send("Juego not found");
  }

  const amount = new BigNumber(juego.precio);
  const message = juego.nombre;
  const memo = juego.nombre;

  try {
    const reference = new PublicKey(process.env.WALLET);
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
      id: req.params.id,
    });
    const { url } = urlData;

    // Generamos el código QR con la URL
    // const qrCodeDataUrl = await QRCode.toDataURL(url);

    return res.status(200).send({ url: url, ref });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

const verifyPayment = async (req, res, next) => {
  const reference = req.params.reference;
  if (!reference) {
    res.status(400).send("Missing reference query parameter");
    return;
  }

  try {
    const referencePublicKey = new PublicKey(reference.toString());
    res.locals.buyerKey = referencePublicKey;
    res.locals.id = paymentData.id;
    const response = await verifyTransaction(referencePublicKey);
    if (response) {
      next();
    } else {
      return res.status(400).send("Payment not verified");
    }
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
  return res.status(405).send("Method not allowed");
};

async function verifyTransaction(reference) {
  const paymentData = paymentRequests.get(reference.toBase58());
  if (!paymentData) {
    return false;
  }

  const { recipient, amount, memo } = paymentData;

  const connection = new Connection(quickNodeEndpoint, "confirmed");

  const found = await findReference(connection, reference);

  const response = await validateTransfer(
    connection,
    found.signature,
    {
      recipient,
      amount,
      splToken: undefined,
      reference,
      memo,
    },
    { commitment: "confirmed" }
  );
  if (response) {
    paymentRequests.delete(reference.toBase58());
  }
}

module.exports = {
  verifyPayment,
  generatePayment,
};
