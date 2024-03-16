const controller = require('../controllers/publicaciones.controller');
const multer = require('multer');
const upload = multer();
const express = require('express');
const { getCache, setCache, deleteCache } = require('../middleware/redis.middleware');
const router = express.Router();

router.get('/',upload.none(), controller.generateCacheKey, getCache,controller.getPublicaciones);  
router.get('/:id',upload.none(), controller.generateCacheKey, getCache,controller.getPublicacionById, setCache);
router.post('/',upload.none(),controller.createPublicacion, deleteCache);
router.put('/:id',upload.none(),controller.updatePublicacion, setCache);
router.delete('/:id',upload.none(),controller.deletePublicacion, deleteCache);

module.exports = router;