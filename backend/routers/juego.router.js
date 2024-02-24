const juegocontroller = require('../controllers/juego.controller');
const multer = require('multer');
const upload = multer();
const express = require('express');
const { route } = require('./usuario.router');
const router = express.Router();

router.get('/',upload.none(),juegocontroller.getJuegos);  
router.post('/',upload.none(),juegocontroller.createJuego);
router.post('/createSeveral',upload.none(),juegocontroller.createSeveralJuegos);
router.put('/:id',upload.none(),juegocontroller.updateJuego);
router.delete('/:id',upload.none(),juegocontroller.deleteJuego);
router.get('/:id',upload.none(),juegocontroller.getJuegoById);

module.exports = router;