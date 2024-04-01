const controller = require('../controllers/usuario.controller.js');
const {verifySession} = require('../middleware/session.middleware.js');
const multer = require('multer');
const upload = multer();
const express = require('express');
const { handleCache } = require('../middleware/redis.middleware.js');
const router = express.Router();

// GET
router.get('/',upload.none(), handleCache,controller.getUsuarios, handleCache);
router.get('/me',upload.none(), verifySession, handleCache,controller.getUsuario, handleCache);
router.get('/wishlist', upload.none(), verifySession, controller.getJuegosInWishList);
router.get('/:username',upload.none(), verifySession, handleCache,controller.getUsuarioById, handleCache);
// POST
// router.post('/logout', controller.logoutUsuario);
router.post('/login',upload.none(),controller.loginUsuario);
router.post('/',upload.none(),controller.createUsuario, handleCache);
router.post('/wishlist/:id', upload.none(), verifySession,controller.addToWishList);
// DELETE
router.delete('/:username',upload.none(),verifySession,controller.deleteUsuario, handleCache);
router.delete('/wishlist/:id',upload.none(),verifySession,controller.removeFromWishList);

// PUT
router.put('/',upload.none(), verifySession, handleCache, controller.updateUsuario, handleCache);
// SAME ROUTE
// router.put('/',upload.none(),verifySession,controller.updateUsuario);

module.exports = router;