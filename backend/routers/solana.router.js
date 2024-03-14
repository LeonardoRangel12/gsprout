const router = require("express").Router();
const solanaPay = require("../apis/solanaPay.api.js");
const { mintNFT, fetchNFTs, fetchNFT } = require("../apis/nft.api.js");
const { generateLicense } = require("../middleware/license.middleware.js");
const multer = require("multer");
const upload = multer();
router.get(
  "/pay/:reference",
  upload.none(),
  solanaPay.verifyPayment,
  generateLicense,
  mintNFT
);
router.post("/pay/:id", upload.none(), solanaPay.generatePayment);
router.get("/wallet/:publicKey/:page", upload.none(), fetchNFTs);
router.get("/wallet/:publicKey", upload.none(), fetchNFT);
module.exports = router;
