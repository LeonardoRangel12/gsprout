const juegocontroller = require('../controllers/juego.controller');
const multer = require('multer');
const upload = multer();
const express = require('express');
const router = express.Router();

router.get('/',upload.none(),juegocontroller.getJuegos);  
router.post('/',upload.none(),juegocontroller.createJuego);
router.put('/:id',upload.none(),juegocontroller.updateJuego);
router.delete('/:id',upload.none(),juegocontroller.deleteJuego);
router.get('/:id',upload.none(),juegocontroller.getJuegoById);

module.exports = router;