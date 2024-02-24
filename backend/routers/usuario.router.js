const userController = require('../controllers/usuario.controller.js');
const multer = require('multer');
const upload = multer();
const express = require('express');
const router = express.Router();

router.get('/',upload.none(),userController.getUsuarios);
router.post('/login',upload.none(),userController.loginUsuario);
router.post('/',upload.none(),userController.createUsuario);
router.put('/:email',upload.none(),userController.updateUsuario);
router.delete('/',upload.none(),userController.deleteUsuario);
router.get('/:email',upload.none(),userController.getUsuarioById);
module.exports = router;