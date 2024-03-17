const controller = require('../controllers/usuario.controller.js');
const {verifySession} = require('../middleware/session.middleware.js');
const multer = require('multer');
const upload = multer();
const express = require('express');
const { getCache, setCache, deleteCache } = require('../middleware/redis.middleware.js');
const router = express.Router();

// GET
router.get('/',upload.none(), controller.generateCacheKey, getCache,controller.getUsuarios, setCache);
router.get('/me',upload.none(),verifySession,controller.getUsuario);
router.get('/:username',upload.none(), verifySession,getCache,controller.getUsuarioById, setCache);
// POST
// router.post('/logout', controller.logoutUsuario);
router.post('/login',upload.none(),controller.loginUsuario);
router.post('/',upload.none(),controller.createUsuario, deleteCache);
router.post('/wishlist/:id', upload.none(), verifySession,controller.addToWishList);
// DELETE
router.delete('/:username',upload.none(),verifySession,controller.deleteUsuario, deleteCache);
router.delete('/wishlist/:id',upload.none(),verifySession,controller.removeFromWishList);

// PUT
router.put('/:username',upload.none(), controller.generateCacheKey, getCache,verifySession,controller.updateUsuario, setCache);
// SAME ROUTE
// router.put('/',upload.none(),verifySession,controller.updateUsuario);

module.exports = router;