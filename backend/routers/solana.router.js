const router = require("express").Router();
const solanaPay = require("../apis/solanaPay.api.js");
const { mintNFT, fetchNFTs, fetchNFT } = require("../apis/nft.api.js");
const { generateLicense } = require("../middleware/license.middleware.js");
const multer = require("multer");
const { setCache, getCache } = require("../middleware/redis.middleware.js");
const upload = multer();
router.get(
  "/pay/:reference",
  upload.none(),
  solanaPay.verifyPayment,
  generateLicense,
  mintNFT
);
router.post("/pay/:id", upload.none(), solanaPay.generatePayment);
router.get("/wallet/:publicKey/:page([1-9]+)", upload.none(), getCache, fetchNFTs, setCache);
router.get("/wallet/:publicKey", upload.none(), getCache, fetchNFT, setCache);
module.exports = router;
