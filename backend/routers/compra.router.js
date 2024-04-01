const router = require("express").Router();
const compracontroller = require("../controllers/compra.controller");
const multer = require("multer");
const {  handleCache } = require("../middleware/redis.middleware");
const upload = multer();

router.get("/:id", upload.none(),  /*handleCache,*/ compracontroller.getCompraById, /*handleCache*/);
router.post("/", upload.none(), compracontroller.createCompra);
router.put("/:id", upload.none(), compracontroller.updateCompra);

module.exports = router;