const router = require("express").Router();
const historialcomprascontroller = require("../controllers/historialcompras.controller");
const multer = require("multer");
const { handleCache } = require("../middleware/redis.middleware");
const upload = multer();

router.post('/', upload.none(), historialcomprascontroller.createHistorialCompra);
router.put('/:id', upload.none(), historialcomprascontroller.updateHistorialCompra);
router.get('/:id', upload.none(), /*handleCache,*/ historialcomprascontroller.getHistorialCompraById, /*handleCache*/);
router.get('/', upload.none(), historialcomprascontroller.getHistorialCompras);

module.exports = router;

