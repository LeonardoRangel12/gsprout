const userController = require('../controllers/usuario.controller.js');
const verify = require('../middleware/session.middleware.js');
const multer = require('multer');
const upload = multer();
const express = require('express');
const router = express.Router();

// RUTA ACTUAL
// /usuarios

router.get('/',upload.none(),verify.verifySession,userController.getUsuarios);
router.get('/me',upload.none(),verify.verifySession,userController.getUsuario);
router.post('/login',upload.none(),userController.loginUsuario);
// router.post('/logout', userController.logoutUsuario);
router.post('/',upload.none(),userController.createUsuario);
router.delete('/:username',upload.none(),verify.verifySession,userController.deleteUsuario);
router.get('/:username',upload.none(),verify.verifySession,userController.getUsuarioById);

// SAME ROUTE
router.put('/:id',upload.none(),verify.verifySession,userController.updateUsuario);
// router.put('/',upload.none(),verify.verifySession,userController.updateUsuario);

module.exports = router;