const controller = require('../controllers/usuario.controller.js');
const verify = require('../middleware/session.middleware.js');
const multer = require('multer');
const upload = multer();
const express = require('express');
const { getCache, setCache, deleteCache } = require('../middleware/redis.middleware.js');
const router = express.Router();

// GET
router.get('/',upload.none(), controller.generateCacheKey, getCache,controller.getUsuarios, setCache);
router.get('/me',upload.none(),verify.verifySession,controller.getUsuario);
router.get('/:username',upload.none(), verify.verifySession,getCache,controller.getUsuarioById, setCache);
// POST
// router.post('/logout', controller.logoutUsuario);
router.post('/login',upload.none(),controller.loginUsuario);
router.post('/',upload.none(),controller.createUsuario, deleteCache);
// DELETE
router.delete('/:username',upload.none(),verify.verifySession,controller.deleteUsuario, deleteCache);

// PUT
router.put('/:username',upload.none(), controller.generateCacheKey, getCache,verify.verifySession,controller.updateUsuario, setCache);
// SAME ROUTE
// router.put('/',upload.none(),verify.verifySession,controller.updateUsuario);

module.exports = router;