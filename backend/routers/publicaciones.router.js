const publicacionesController = require('../controllers/publicaciones.controller');
const multer = require('multer');
const upload = multer();
const express = require('express');
const { getCache, setCache } = require('../middleware/redis.middleware');
const router = express.Router();

router.get('/',upload.none(),publicacionesController.getPublicaciones);  
router.get('/:id',upload.none(), getCache,publicacionesController.getPublicacionById, setCache);
router.post('/',upload.none(),publicacionesController.createPublicacion);
router.put('/:id',upload.none(),publicacionesController.updatePublicacion);
router.delete('/:id',upload.none(),publicacionesController.deletePublicacion);

module.exports = router;