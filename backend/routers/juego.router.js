const controller = require('../controllers/juego.controller');
const multer = require('multer');
const upload = multer();
const express = require('express');
const { handleCache } = require('../middleware/redis.middleware');
const router = express.Router();

// GET
router.get('/',upload.none(), handleCache,controller.getJuegos, handleCache);  
router.get('/:id', upload.none(),handleCache,controller.getJuegoById, handleCache);

//No cached yet
router.get('/search/autoComplete/:query', upload.none(), controller.autocompleteJuegosSearch);

//No cached yet
router.post('/search', upload.none(), controller.searchJuegos);
// POST
router.post('/',upload.none(),controller.createJuego, handleCache);
router.post('/createSeveral',upload.none(),controller.createSeveralJuegos, handleCache);
// PUT
router.put('/:id',upload.none(),controller.updateJuego, handleCache);
// DELETE
router.delete('/:id',upload.none(),controller.deleteJuego, handleCache);

module.exports = router;