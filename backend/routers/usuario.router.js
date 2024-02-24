const userController = require('../controllers/usuario.controller.js');
const multer = require('multer');
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const app = express();

router.get('/',userController.getUsuarios);
router.post('/login',userController.loginUsuario);
router.post('/',userController.createUsuario);
router.put('/:email',userController.updateUsuario);
router.delete('/',userController.deleteUsuario);
router.get('/:email',userController.getUsuarioById);
module.exports = router;