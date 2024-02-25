const router = require("express").Router();
const historialcomprascontroller = require("../controllers/historialcompras.controller");
const multer = require("multer");
const upload = multer();
const deseadosController = require("../controllers/deseados.controller");
router.get('/:idusuario/', upload.none(), deseadosController.getDeseadosByUsuario);
router.put('/:idusuario/:idjuego', upload.none(), deseadosController.addToDeseadosByUsuario);
router.delete('/:idusuario/:idjuego', upload.none(), deseadosController.deleteJuegoOfDeseados);

module.exports = router;

