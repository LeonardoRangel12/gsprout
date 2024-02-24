const usercontroller = require('../controllers/usuario.controller.js');
const multer = require('multer');
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const app = express();

router.post('/login',usercontroller.login);
router.post('/',usercontroller.register);
router.put('/:email',usercontroller.update);
router.delete('/',usercontroller.delete);
router.get('/:email',usercontroller.getUsuarioById);
module.exports = router;