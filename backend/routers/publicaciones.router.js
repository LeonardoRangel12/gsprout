const publicacionesController = require('../controllers/publicaciones.controller');
const multer = require('multer');
const upload = multer();
const express = require('express');
const router = express.Router();

router.get('/',upload.none(),publicacionesController.getPublicaciones);  
router.get('/:id',upload.none(),publicacionesController.getPublicacionById);
router.post('/',upload.none(),publicacionesController.createPublicacion);
router.put('/:id',upload.none(),publicacionesController.updatePublicacion);
router.delete('/:id',upload.none(),publicacionesController.deletePublicacion);

module.exports = router;