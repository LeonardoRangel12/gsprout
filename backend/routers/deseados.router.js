const router = require("express").Router();
const historialcomprascontroller = require("../controllers/historialcompras.controller");
const multer = require("multer");
const upload = multer();

router.get('/:idusuario/:idjuego', upload.none(), deseadosController.getDeseados);
router.post('/:idusuario/:idjuego', upload.none(), deseadosController.addToDeseados);
router.delete('/:idusuario/:idjuego', upload.none(), deseadosController.deleteFromDeseados);

module.exports = router;

