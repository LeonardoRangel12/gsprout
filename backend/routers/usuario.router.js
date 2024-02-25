const userController = require('../controllers/usuario.controller.js');
const verify = require('../middleware/session.middleware.js');
const multer = require('multer');
const upload = multer();
const express = require('express');
const router = express.Router();

router.get('/',upload.none(),verify.verifySession,userController.getUsuarios);
router.get('/me',upload.none(),verify.verifySession,userController.getUsuario);
router.post('/login',upload.none(),userController.loginUsuario);
router.post('/logout', userController.logoutUsuario);
router.post('/',upload.none(),userController.createUsuario);
router.put('/:id',upload.none(),verify.verifySession,userController.updateUsuario);
router.delete('/:email',upload.none(),verify.verifySession,userController.deleteUsuario);
router.get('/:email',upload.none(),verify.verifySession,userController.getUsuarioById);
router.put('/',upload.none(),verify.verifySession,userController.updateUsuario);

module.exports = router;