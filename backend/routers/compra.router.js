const router = require("express").Router();
const compracontroller = require("../controllers/compra.controller");
const multer = require("multer");
const { getCache, setCache } = require("../middleware/redis.middleware");
const upload = multer();

router.get("/:id", upload.none(), getCache, compracontroller.getCompraById, setCache);
router.post("/", upload.none(), compracontroller.createCompra);
router.put("/:id", upload.none(), compracontroller.updateCompra);

module.exports = router;