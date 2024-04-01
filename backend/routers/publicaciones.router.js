const controller = require('../controllers/publicaciones.controller');
const multer = require('multer');
const upload = multer();
const express = require('express');
const { handleCache } = require('../middleware/redis.middleware');
const router = express.Router();

router.get('/',upload.none(), handleCache,controller.getPublicaciones);  
router.get('/:id',upload.none(), handleCache,controller.getPublicacionById, handleCache);
router.post('/',upload.none(),controller.createPublicacion, handleCache);
router.put('/:id',upload.none(),controller.updatePublicacion, handleCache);
router.delete('/:id',upload.none(),controller.deletePublicacion, handleCache);

module.exports = router;