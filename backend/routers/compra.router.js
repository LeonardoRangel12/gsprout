const router = require("express").Router();
const compracontroller = require("../controllers/compra.controller");
const multer = require("multer");
const upload = multer();

router.get("/", upload.none(), compracontroller.getCompraById);
router.post("/", upload.none(), compracontroller.createCompra);
router.put("/:id", upload.none(), compracontroller.updateCompra);

module.exports = router;