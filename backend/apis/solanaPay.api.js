const {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} = require("@solana/web3.js");
const {
  encodeURL,
  validateTransfer,
  parseURL,
  TransferRequestURL,
  findReference,
} = require("@solana/pay");
const BigNumber = require("bignumber.js");

// CONSTANTS
const destinyWallet = process.env.WALLET;
const recipient = new PublicKey(destinyWallet);
const quickNodeEndpoint = process.env.QUICKNODE_URL;
const label = "GSprout";
const memo = "GSprout memo";
const amount = new BigNumber(0.1); // 0.1 SOL
const paymentRequests = new Map();
paymentRequests.set(String, {
  recipient: PublicKey,
  amount: BigNumber,
  memo: String,
});
// const privateKey =
//   "2YMdT9LcxnqbnYtHcBdGFeWtSSrYFMntAiLJn3isfA7VZKBeDuddu8kTdZ8rZEuS2PLGne3DtipNsMDghN7mpR7F";
// const privateKeyBytes = base58.decode(privateKey);
// const keypair = Keypair.fromSecretKey(privateKeyBytes);

const generatePayment = async (req, res) => {
  if (req.method === "POST") {
    try {
      const reference = new Keypair().publicKey;
      const message = "GSprout Payment";
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
      const url = urlData;
      res.status(200).send({ url: url.toString(), ref });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  } else if (req.method === "GET") {
    const reference = req.params.reference;
    if (!reference) {
      res.status(400).send("Missing reference query parameter");
      return;
    }

    try{
        const referencePublicKey = new PublicKey(reference);
        const response = await verifyTransaction(referencePublicKey);

        if(response){
            res.status(200).send("Payment verified");
        }
        else{
            res.status(400).send("Payment not verified");
        }
    }
    catch(error){
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(405).send("Method not allowed");
  }
};

async function generateUrl(
  recipient,
  amount,
  reference = "",
  label = "",
  message = "",
  memo = ""
) {
  const url = encodeURL({
    recipient,
    amount,
    reference,
    label,
    message,
    memo,
  });
  return url;
}

const verifyTransaction = async (reference) => {
  const paymentData = paymentRequests.get(reference.toBase58());
  if (!paymentData) throw new Error("Payment not found");

  const { recipient, amount, memo } = paymentData;

  const connection = new Connection(quickNodeEndpoint, "confirmed");
  console.log("memo", memo);

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

  if (response){
    paymentRequests.delete(reference.toBase58());
  }
  return response;
};

module.exports = {
  generateUrl,
  generatePayment,
};
