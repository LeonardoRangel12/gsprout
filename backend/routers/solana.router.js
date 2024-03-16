const router = require("express").Router();
const solanaPay = require("../apis/solanaPay.api.js");
const { mintNFT, fetchNFTs, fetchNFT, generateCacheKey } = require("../controllers/nft.controller.js");
const { generateLicense } = require("../middleware/license.middleware.js");
const multer = require("multer");
const { setCache, getCache } = require("../middleware/redis.middleware.js");
const upload = multer();

// GET
router.get(
  "/pay/:reference",
  upload.none(),
  solanaPay.verifyPayment,
  generateLicense,
  mintNFT
);

router.get("/wallet/:publicKey/:page([1-9]+)", upload.none(), generateCacheKey, getCache, fetchNFTs, setCache);
router.get("/wallet/:publicKey", upload.none(), generateCacheKey, getCache, fetchNFT, setCache);

// POST
router.post("/pay/:id", upload.none(), solanaPay.generatePayment);
module.exports = router;
