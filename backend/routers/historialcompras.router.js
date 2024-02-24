const router = require("express").Router();
const historialcomprascontroller = require("../controllers/historialcompras.controller");
const multer = require("multer");
const upload = multer();

router.get('/:idusuario', upload.none(), historialcomprascontroller.getHistorialCompras);
router.post('/', upload.none(), historialcomprascontroller.createHistorialCompra);
router.get('/:id', upload.none(), historialcomprascontroller.getHistorialCompraById);
router.put('/:id', upload.none(), historialcomprascontroller.updateHistorialCompra);

module.exports = router;

