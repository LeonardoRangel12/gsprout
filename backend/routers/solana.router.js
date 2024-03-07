const router = require("express").Router();
const solanaPay = require("../apis/solanaPay.api.js");
const { mintNFT, getNFTs } = require("../apis/nft.api.js");
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
router.get("/wallet/:publicKey", upload.none(), getNFTs);
module.exports = router;
