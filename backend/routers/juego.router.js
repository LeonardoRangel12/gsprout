const controller = require('../controllers/juego.controller');
const multer = require('multer');
const upload = multer();
const express = require('express');
const { getCache, setCache, deleteCache } = require('../middleware/redis.middleware');
const router = express.Router();

// GET
router.get('/',upload.none(), controller.generateCacheKey, getCache,controller.getJuegos, setCache);  
router.get('/:id', upload.none(),controller.generateCacheKey, getCache,controller.getJuegoById, setCache);
// POST
router.post('/',upload.none(),controller.createJuego, deleteCache);
router.post('/createSeveral',upload.none(),controller.createSeveralJuegos, deleteCache);
// PUT
router.put('/:id',upload.none(),controller.updateJuego, setCache);
// DELETE
router.delete('/:id',upload.none(),controller.deleteJuego, deleteCache);

module.exports = router;